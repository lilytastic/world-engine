import { ILanguage, TypedSound } from "./sounds.model";

export interface IPhonology {
  syllableShape: string;
  stressSystem: string;
  phonotactics: IPhonotactic[];
}

export interface IPhonotactic {
  id: number;
  type: string;
  description: string;
  script: string;
}

export interface IPhonologicalToken {
  type: string;
  items: string[];
}

export interface IPhonologicalRule {
  type: string;
  tokens: IPhonologicalToken[];
  script: string;
} 

export enum PhonologicalTokens {
  Addition = '+',
  Subtractive = '-',
  Transform = '>',
  Filter = '/',
  Self = '_',
  Deletion = 'Ø',
  Syllable = 'σ',
  Word = '#'
}

export enum PhonologicalTokenCollectionTypes {
  Terms = 'term collection',
  Conditional = 'conditional collection',
  Logical = 'logical collection',
  LogicalOptional = 'optional logical collection',
  Phonetic = 'phonetic collection',
}

export const BOUNDARY_MARKERS: [string, string, string][] = [
  [PhonologicalTokenCollectionTypes.Terms, '[', ']'],
  [PhonologicalTokenCollectionTypes.Conditional, '<', '>'],
  [PhonologicalTokenCollectionTypes.Logical, '{', '}'],
  [PhonologicalTokenCollectionTypes.LogicalOptional, '(', ')'],
  [PhonologicalTokenCollectionTypes.Phonetic, '/', '/']
];

/*

Ideal Syntax:

[light] = CV
[heavy] = CVV, CVC
[superheavy] = CVVC, CVCC

*/


export function getSound(language: ILanguage, phoneme: string) {
  let sounds = [...language.vowels, ...language.consonants];
  return sounds.find(x => x.phoneme === phoneme);
}
export function getSounds(language: ILanguage, token: IPhonologicalToken, tokenItem: string) {
  let sounds = [...language.vowels, ...language.consonants];
  switch (token.type) {
    case PhonologicalTokenCollectionTypes.Phonetic:
      return sounds.filter(sound => sound.phoneme === tokenItem);
    case PhonologicalTokenCollectionTypes.Terms:
      return sounds.filter(sound => doesSoundMatchToken(sound, tokenItem));
    default:
      return [];
  }
}
export function doesSoundMatchToken(sound: TypedSound, token: string) {
  switch (token.toLowerCase()) {
    case 'voiced':
      return sound.voiced;
    case 'unvoiced':
      return !sound.voiced;
    case 'rounded':
      if (sound.type === "vowel") {
        return sound.rounded;
      }
      break;
    case 'vowels':
      if (sound.type === "vowel") {
        return true;
      } else {
        return false;
      }
      break;
    case 'consonants':
      if (sound.type === "consonant") {
        return true;
      } else {
        return false;
      }
      break;
    case 'fricatives':
      if (sound.type === "consonant") {
        return sound.manner.toLowerCase().includes('fricative');
      } else {
        return false;
      }
    case 'affricates':
      if (sound.type === "consonant") {
        return sound.manner.toLowerCase().includes('affricate');
      } else {
        return false;
      }
    default:
      if (sound.type === "vowel") {
        return sound.openness.toLowerCase() === token.toLowerCase() || sound.frontness.toLowerCase() === token.toLowerCase()
      }
      if (sound.type === "consonant") {
        return sound.manner.toLowerCase() === token.toLowerCase().slice(0, -1) || sound.place.toLowerCase() === token.toLowerCase().slice(0, -1);
      }
      break;
  }
  return false;
}

export const getAffectedSounds = (language: ILanguage, tokens: IPhonologicalToken[]): {permitted: TypedSound[], forbidden: TypedSound[]} => {
  let sounds: TypedSound[] = [...language.vowels, ...language.consonants];
  let permitted: TypedSound[] = [];
  let forbidden: TypedSound[] = [];
  let allowAutoOpen = true;

  let _sounds: TypedSound[] = [];

  for (let ci = 0; ci < tokens.length; ci++) {
    const token = tokens[ci];
    const nextToken = tokens[ci + 1];
    let operativeToken = token;

    if (token.type === '-') {
      // If you're just removing sounds, assume it's removing from the full set.
      if (nextToken?.items.length > 0) {
        _sounds = nextToken.items.map(item => getSounds(language, nextToken, item)).flat();
        forbidden = [...forbidden, ..._sounds];
      }
      ci++;
    } else if (token.type === '+' || token.type.includes('collection')) {
      allowAutoOpen = false;
      const collectionToken = token.type === '+' ? nextToken : token;
      if (collectionToken.items.length > 0) {
        _sounds = collectionToken.items.map(item => getSounds(language, collectionToken, item)).flat();
        permitted = [...permitted, ..._sounds];
      }
      if (token.type === '+') {
        ci++;
      }
    } 
  }

  return {permitted, forbidden};
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
      default:
        const boundaryMarker = BOUNDARY_MARKERS.find(x => x[1] === script[i]);
        if (boundaryMarker) {
          useScratch = true;
          next = script.indexOf(boundaryMarker[2], i + 1);
          if (next !== -1) {
            newToken = {type: boundaryMarker[0], items: script.slice(i + 1, next).split(',').map(x => x.trim())};
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
