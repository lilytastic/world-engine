import { CONSONANTS } from "../data/consonants";
import { VOWELS } from "../data/vowels";
import { ILanguage } from "../models/language.model";
import { BOUNDARY_MARKERS, IPhonologicalRule, IPhonologicalToken, IPhonotactic, ISoundRules, PhonologicalTokenCollectionTypes, PhonologicalTokens, SoundPositions } from "../models/phonology.model";
import { IPhonemeClass, ISound } from "../models/sounds.model";
import { getRandomArrayItem, insertString, splitVariableToken, toDictionary } from "./logic.helpers";

export enum PhonologicalTokenType { ClassToken, Phoneme, Unknown };
export type PhonologicalToken = {token: string, type: PhonologicalTokenType};

export function getDefaultPositions(language: ILanguage, phoneme: string): SoundPositions[] {
  if (!!VOWELS.find(x => x.phoneme === phoneme)) {
    return [SoundPositions.Close, SoundPositions.Nucleus, SoundPositions.Start];
  }
  return [SoundPositions.Close, SoundPositions.Coda, SoundPositions.Onset, SoundPositions.Start];
}

export function generateDefaultRule(language: ILanguage, sound: ISound): ISoundRules {
  const defaultPositions = getDefaultPositions(language, sound.phoneme);
  return {positionsAllowed: defaultPositions, canCluster: false};
}


export const generateRules = (phonotactics: IPhonotactic[]): IPhonologicalRule[] => {
  return phonotactics.map(tactic => {
    let type = tactic.description;
    let script = tactic.script;
    const tokens = getTokens(script);
    return {type, script, tokens};
  });
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

export type PhonemeClassDictionary = {[id: string]: IPhonemeClass};
export function getPhonemeClassDictionary(language: ILanguage): PhonemeClassDictionary {
  return toDictionary(getPhonemeClasses(language), (o) => o.className);
}

export function getSoundChanges(language: ILanguage): string[] {
  return language.phonology.soundChanges.split('\n').filter(x => x.trim().length > 0);
}

const REGEX_ALL_CONSONANTS = `(${CONSONANTS.map(x => x.phoneme).join('|')})`;
const REGEX_ALL_VOWELS = `(${VOWELS.map(x => x.phoneme).join('|')})`;

export function regexifyVariableToken(token: string) {
  const openingBracket = token.indexOf('{');
  const closingBracket = token.indexOf('}');
  if (openingBracket !== -1 && closingBracket !== -1) {
    return`(${token.slice(0, openingBracket)}(${splitVariableToken(token).join('|')})${token.slice(closingBracket + 1)})`;
    // console.log(inEnvironmentOf);
  }
  return token;
}

export function applyPhonologicalRule(environment: string, changeRule: string) {
  changeRule = changeRule
                        .replace(/_#/g, '_$')
                        .replace(/#_/g, '^_')
                        .replace(/#/g, '\\b')
                        .replace(/(\((.*?)\))/g, `($2?)`)
                        .replace(new RegExp('C', 'g'), REGEX_ALL_CONSONANTS)
                        .replace(new RegExp('V', 'g'), REGEX_ALL_VOWELS)

  let instruction = changeRule;
  let inEnvironmentOf = '';

  if (changeRule.includes('/')) {
    let tokens = changeRule.split('/').map(x => x.trim());
    instruction = tokens[0];
    inEnvironmentOf = tokens[1];
    // applies = environment.includes(tokens[1]);
  }

  // NOTE: Conflicts with regex on line 60. And do it for instruction too.
  inEnvironmentOf = regexifyVariableToken(inEnvironmentOf);
  let [target, result] = instruction.split('>').map(x => x.trim());
  instruction = regexifyVariableToken(instruction);
  target = regexifyVariableToken(target);

  let isNegated = false;
  
  if (inEnvironmentOf.startsWith('!')) {
    isNegated = true;
    inEnvironmentOf = inEnvironmentOf.slice(1);
  }

  let matchFor = target;
  const test = inEnvironmentOf
    ? new RegExp(inEnvironmentOf.replace('_', matchFor), 'g')
    : new RegExp(matchFor, 'g');

  let matches = [...environment.matchAll(test)];
  let contramatches: RegExpMatchArray[] | null = null;
  // console.log(matches, matchFor, inEnvironmentOf, environment);

  if (isNegated) {
    contramatches = matches;
    matches = [...environment.matchAll(new RegExp(matchFor, 'g'))];
    // TODO: Contramatches, negated matches, aren't implemented yet.
    //console.log(contramatches, changeRule);
  }

  // console.log(changeRule, matches, matchFor, inEnvironmentOf, matches);
  if (matches && matches.length > 0) {
    //console.log(changeRule, matches, matchFor, inEnvironmentOf, matches);
    // console.log(environment, target, inEnvironmentOf, matchFor, environment.match(new RegExp(matchFor, 'g')), matches, '>', result);
    matches.filter(match => match.values()).forEach(match => {
      const realTarget = match[0].match(matchFor)?.[0];
      // TODO: Seems to get confused sometimes, and catches an earlier match, even if it's invalid :C
      if (!realTarget) { console.error(`couldn't find a real target`, match, matchFor, isNegated); return; }
      const index = environment.indexOf(realTarget, match.index || 0);
      // console.log(environment, match, result, realTarget, index);
      const finalResult = getRandomArrayItem(splitVariableToken(result));
      environment = insertString(environment, finalResult, index, realTarget.length - 1);
    });
  }
  return environment;
}

export function applySoundChanges(language: ILanguage, filledWordStr: string): string {
  const soundChanges = getSoundChanges(language);
  let environment = filledWordStr; // `#${filledWordStr}#`;
  soundChanges.forEach(changeRule => {
    environment = applyPhonologicalRule(environment, changeRule);
  });
  return environment;
}

export const getTokens = (script: string) => {
  let tokens: IPhonologicalToken[] = [];
  let scratch = '';
  let useScratch = false;

  for (let i = 0; i < script.length; i++) {
    let next = 0;
    let newToken = null as IPhonologicalToken | null;

    switch (script[i]) {
      case PhonologicalTokens.Addition:
      case PhonologicalTokens.Subtractive:
      case PhonologicalTokens.Transform:
      case PhonologicalTokens.Deletion:
      case PhonologicalTokens.Syllable:
      case PhonologicalTokens.Word:
        newToken = {type: script[i], items: []};
        break;
      case PhonologicalTokens.Self:
        // Put stuff here!
        newToken = {type: '_', items: []};
        while (script[i + 1] === '_') {
          i++
        }
        break;
      // @ts-ignore;
      case PhonologicalTokens.Filter:
        if (script[i + 1] === ' ') {
          // This means "in the environment of"!
          newToken = {type: '/', items: []};
          break;
        }
        continue;
      default:
        const boundaryMarker = BOUNDARY_MARKERS.find(x => x[1] === script[i]);
        if (boundaryMarker) {
          useScratch = true;
          next = script.indexOf(boundaryMarker[2], i + 1);
          if (next !== -1) {
            newToken = {
              type: boundaryMarker[0],
              items: script.slice(i + 1, next).split(',').map(x => x.trim())
            };
            i = next+1;
          }
        } else {
          useScratch = false;
          scratch += script[i];
        }
        break;
    }

    if (newToken) {
      useScratch = true;
    }
    if (useScratch || i === script.length - 1) {
      const items = scratch.trim().split(',').map(x => x.trim()).filter(x => x.length > 0);
      if (items.length > 0) {
        tokens.push({type: PhonologicalTokenCollectionTypes.Terms, items})
        scratch = '';  
      }
    }
    if (newToken) {
      tokens.push(newToken);
    }
  }

  return tokens;
}
