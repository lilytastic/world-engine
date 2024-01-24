import { ILanguage } from "../models/language.model";
import { IPhonologicalToken } from "../models/phonology.model";
import { TypedSound } from "../models/sounds.model";
import { ALL_PHONEMES } from "./generators.old.helpers";
import { PhonemeClassDictionary, PhonologicalToken, PhonologicalTokenType, getPhonemeClassDictionary } from "./phonology.helpers";

export type PhonemeOrString = TypedSound | string;
export type PhonemeStringArray = PhonemeOrString[];
export enum ProbabilityType {
  FastDropoff,
  MediumDropoff,
  Equiprobable
}
export type StringEnvironment = { environment: string; position: number; }
export const EMPTY_ENVIRONMENT = '_';

export function checkForToken(tokens: IPhonologicalToken[], key: string) {
  return tokens.find(x => !!x.items.find(x => x.toLowerCase() === key));
}

export function getStringArray(str: string) {
  let arr: string[] = [];
  for (let i = 0; i < str.length; i++) {
    arr.push(str[i]);
  }
  return arr.filter(x => x !== ' ');
}


export function getRandomArrayItem<T>(arr: T[], probabilityType?: ProbabilityType) {
  let range = arr.length;
  let probability = Math.random() * 1.0;
  switch (probabilityType) {
    case ProbabilityType.FastDropoff:
      range = arr.length * probability;
      break;
    case ProbabilityType.MediumDropoff:
      range = arr.length * (probability * 1.5);
      break;
    default:
      break;
  }
  return arr[Math.min(arr.length - 1, Math.floor(Math.random() * range))];
}

export function extractPhonemeStringArray (str: string): PhonemeStringArray {
  return getStringArray(str).map(token => ALL_PHONEMES.find(x => x.phoneme === token) || token);
}

export function transcribePhonemeStringArray(phonemes: PhonemeStringArray): string {
  return phonemes.map(transcribePhonemeOrString).join('');
}

export function toDictionary<T>(arr: T[], indexBy?: (obj: T) => string): {[id: string]: T} {
  const dictionary: {[id: string]: T} = {};
  arr.forEach((obj, i) => {
    dictionary[indexBy?.(obj) ?? i] = obj;
  });

  return dictionary;
}

export const extrudeAlternatingRule = (rule: string): string[] => {
  const index = rule.indexOf('{');
  const lastIndex = rule.indexOf('}');
  if (index === -1 || lastIndex === -1) {
    return [];
  }
  const enclosed = rule.slice(index + 1, lastIndex).split(',');
  // console.log(enclosed, rule);
  return enclosed.map(token => rule.slice(0, index) + token + rule.slice(lastIndex + 1));
}

export const insertString = (str: string, item: string, position: number, remove = 0): string => {
  return `${str.slice(0, position)}${item}${str.slice(position + (1 + remove))}`;
}

export const markPositionInEnvironment = (env: StringEnvironment, mark = '_') => {
  const { environment, position } = env;
  return insertString(environment, mark, position, 1);
}

export const transcribePhonemeOrString = (str: PhonemeOrString) => {
  const sound = (str as TypedSound);
  if (sound.phoneme) {
    return sound.romanization || sound.phoneme;
  }
  return str;
}

export const filterSoundsFromPhonemeStringArray = (phonemes: PhonemeStringArray): TypedSound[] => {
  return phonemes.filter(x => !!(x as TypedSound).phoneme) as TypedSound[]
}

export function fillToken(language: ILanguage, phonemeClasses: PhonemeClassDictionary, env: StringEnvironment): PhonologicalToken | null {
  const {environment, position} = env;
  const token = environment[position];
  const phoneme = ALL_PHONEMES.find(x => x.phoneme === token);
  const phonemeClass = phonemeClasses[token];
  if (!!phonemeClass) {
    const appropriateTokens = filterForbiddenCombinations(markPositionInEnvironment(env), language, phonemeClass.tokens);
    const dropoff = language.phonology.dropoffRate || ProbabilityType.MediumDropoff;
    const randomAppropriateToken = getRandomArrayItem(appropriateTokens, dropoff);
    const isClassToken = !!phonemeClasses[randomAppropriateToken] || randomAppropriateToken.toLowerCase() !== randomAppropriateToken;
    if (randomAppropriateToken) {
      return { token: randomAppropriateToken, type: isClassToken ? PhonologicalTokenType.ClassToken : PhonologicalTokenType.Phoneme };
    } else if (!phoneme) {
      console.error('no options for ', phonemeClasses[token].tokens, environment);
      return null;
    }
  } else if (phoneme) {
    return { token: phoneme.phoneme, type: PhonologicalTokenType.Phoneme };
  } else {
    return { token, type: PhonologicalTokenType.Unknown };
    // environment = insertString(environment, token, pos);
  }
  return null;
}


export function filterForbiddenCombinations(environment: string, language: ILanguage, collection: string[]): string[] {
  environment = `#${environment}#`;
  const forbiddenCombinations = language.phonology.forbiddenCombinations.split(' ').map(x => ([x, ...extrudeAlternatingRule(x)])).flat();
  let environmentWithClasses = environment.toString();
  
  // TODO: Interpret all consonants as C and all vowels as V. Ignore the phoneme classes.
  const phonemeClasses = getPhonemeClassDictionary(language);

  Object.keys(phonemeClasses).forEach(classToken => {
    const phonemeClass = phonemeClasses[classToken];
    phonemeClass.tokens.filter(x => x.toLowerCase() === x).sort((a, b) => a.length > b.length ? -1 : b.length > a.length ? 1 : 0).forEach(token => {
      const regex = new RegExp(token, "g");
      environmentWithClasses = environmentWithClasses.replace(regex, classToken);
    });
  });

  const allowed = collection.filter(_token => {
    let tokens = [
      _token,
      // ...(_token.toLowerCase() === _token ? Object.keys(phonemeClasses).filter(t => phonemeClasses[t].tokens.includes(_token)) : [])
      // ...extrudeAlternatingRule(_token)
    ];
    

    for (let i = 0; i < forbiddenCombinations.length; i++) {
      const forbiddenCombination = forbiddenCombinations[i];

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const includes = environment.replace('_', token).includes(forbiddenCombination)
                         || environmentWithClasses.replace('_', token).includes(forbiddenCombination);
                         
        const includesWithoutBoundaries = environment.replace('_', token).replace(/#/g, '').includes(forbiddenCombination)
                                          || environmentWithClasses.replace('_', token).replace(/#/g, '').includes(forbiddenCombination);
  
        const test = forbiddenCombination.length > 0
                    && (includes || includesWithoutBoundaries);
  
        if (test) {
          //console.log('testing', environment.replace('_', token), `${test} (${forbiddenCombination})`);
          return false;
        }
      }
    }
    //console.log('testing', environment.replace('_', token), `OK!`);
    return true;
  });
  // console.log(environment, forbiddenCombinations, allowed);
  return allowed;
}
