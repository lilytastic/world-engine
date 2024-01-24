import { TypedSound, IPhonemeClass, IWordPattern } from "../models/sounds.model";
import { getWordPatternDictionary } from "./word-patterns.helpers";
import { ProbabilityType, getRandomArrayItem } from "./logic.helpers";
import { ILanguage, IWord } from "../models/language.model";
import { IPhonologicalToken } from "../models/phonology.model";
import { CONSONANTS } from "../data/consonants";
import { VOWELS } from "../data/vowels";

// TODO: Try to implement some of https://github.com/conlang-software-dev/Logopoeist
// TODO: Also this https://www.vulgarlang.com/sound-changes

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

export function getPhonemeClasses(language: ILanguage): IPhonemeClass[] {
  return language.phonology.phonemeClasses?.split('\n').map(token => {
    const splitOnIndex = token.indexOf('=');
    if (splitOnIndex !== -1) {
      return {
        className: token.slice(0, splitOnIndex).trim(),
        tokens: token.slice(splitOnIndex + 1).split(' ').filter(x => x.trim() !== '')
      }
    }
    return undefined;
  }).filter(x => !!x) as IPhonemeClass[];
}

export function getPhonemeClassDictionary(language: ILanguage) {
  const classes = getPhonemeClasses(language);
  const dictionary: {[className: string]: IPhonemeClass} = {};
  classes.forEach(c => {
    dictionary[c.className] = c;
  });

  return dictionary;
}

export function getSampleWords(language: ILanguage) {
  let arr: IWord[] = [];
  for (let i = 0; i < 30; i++) {
    arr.push(generateWord(language));
  }
  return arr;
}

export function generateWord(language: ILanguage, type = 'word'): IWord {
  const ALL_PHONEMES = [...CONSONANTS, ...VOWELS];
  const wordPatterns = getWordPatternDictionary(language)[type];
  
  const wordPattern = getRandomArrayItem(filterForbiddenCombinations('#_#', language, wordPatterns.map(x => x.pattern.join(''))));

  const string = processWordPattern(
    language,
    `#${wordPattern}#`
  );
  const phonemes = getStringArray(string).map(token => ALL_PHONEMES.find(x => x.phoneme === token) || token);
  const transcription = phonemes.map(x => {
    const sound = (x as TypedSound);
    if (sound.phoneme) {
      return sound.romanization || sound.phoneme;
    }
    if (x === '#') { return ''; }
    return x;
  }).join('');
  const sounds = phonemes.filter(x => !!(x as TypedSound).phoneme) as TypedSound[];

  return { transcription, sounds };
}

const ALL_PHONEMES = [...CONSONANTS, ...VOWELS];

export function processWordPattern(language: ILanguage, env: string): string {
  let environment = env;
  const phonemeClasses = getPhonemeClassDictionary(language);
  let timesLooped = 0;

  for (let i = 0; i < environment.length; i++) {
    const token = environment[i];
    if (token === '#') { continue; }

    if (timesLooped > 10) {
      // TRY AGAIN
      // console.error('I SURRENDER', env);
      return processWordPattern(language, env);
    }

    const phoneme = ALL_PHONEMES.find(x => x.phoneme === token);
    if (phonemeClasses[token]) {
      let currentEnvironment = `${environment.slice(0, i)}_${environment.slice(i + 2)}`;
      if (!currentEnvironment.endsWith('#')) {currentEnvironment += '#';}
      const classTokens = filterForbiddenCombinations(currentEnvironment, language, phonemeClasses[token].tokens);
      // console.log(currentEnvironment, classTokens);
      const item = getRandomArrayItem(classTokens, language.phonology.dropoffRate || ProbabilityType.MediumDropoff);
      if (item) {
        environment = `${environment.slice(0, i)}${item}${environment.slice(i + 1)}`;
        i -= 1;
        timesLooped++;
      } else if (!phoneme) {
        // console.error('no options for ', phonemeClasses[token].tokens, currentEnvironment);
        // We can't do anything with this token. Start over.
        i = 0;
        timesLooped++;
        environment = env;
      }
    } else if (phoneme) {
      environment = `${environment.slice(0, i)}${phoneme.phoneme}${environment.slice(i + 1)}`;
      timesLooped = 0;
    } else {
      environment = `${environment.slice(0, i)}${token}${environment.slice(i + 1)}`;
    }
  }
  return environment;
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

export function filterForbiddenCombinations(environment: string, language: ILanguage, collection: string[]): string[] {
  
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
