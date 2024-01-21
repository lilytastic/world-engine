import { VOWELS } from "../data/vowels";
import { ILanguage } from "../models/language.model";
import { BOUNDARY_MARKERS, IPhonologicalRule, IPhonologicalToken, IPhonotactic, ISoundRules, PhonologicalTokenCollectionTypes, PhonologicalTokens, SoundPositions } from "../models/phonology.model";
import { ISound } from "../models/sounds.model";



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

export const processWordFromDictionary = (item: string) => {
  let wordType = 'n';
  let meaning = '';

  const curlyBracketStart = item.indexOf('{');
  if (curlyBracketStart !== -1) {
    const curlyBracketEnd = item.indexOf('}');
    item = item.slice(0, curlyBracketStart) + item.slice(curlyBracketEnd + 1);
  }

  const bracketStart = item.indexOf('(');
  if (bracketStart !== -1) {
    const bracketEnd = item.indexOf(')');
    meaning = item.substring(bracketStart + 1, bracketEnd);
    item = item.slice(0, bracketStart) + item.slice(bracketEnd + 1);
  }

  const sqBracketStart = item.indexOf('[');
  if (sqBracketStart !== -1) {
    const sqBracketEnd = item.indexOf(']');
    wordType = item.substring(sqBracketStart + 1, sqBracketEnd);
    item = item.slice(0, sqBracketStart) + item.slice(sqBracketEnd + 1);
  }
  const variations = item.split(',').map(x => x.trim()).filter(x => !!x);

  if (!variations.length) { return null; }
  return {label: `${variations[0]} [${wordType}]`, variations, meaning, wordType};
}
