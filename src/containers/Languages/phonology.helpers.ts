import { IConsonant, ILanguage, ITypedSound, IVowel } from "./sounds.model";

export interface IPhonology {
  syllableShape: string;
  stressSystem: string;
  phonotactics: IPhonotactic[];
}

export interface IPhonotactic {
  script: string;
}

interface IPhonologicalToken {type: string, items: string[]}

export interface IPhonologicalRule {
  tokens: IPhonologicalToken[];
  type: string;
  script: string;
}

export function getSound(language: ILanguage, key: string) {
  let sounds = [...language.vowels, ...language.consonants];
  return sounds.find(x => x.key === key);
}
export function getSounds(language: ILanguage, type: string, key: string) {
  let sounds = [...language.vowels, ...language.consonants];
  switch (type) {
    case 'phonetic collection':
      return sounds.filter(x => x.key === key);
    case 'digraph collection':
      return sounds.filter(x => fitsArbitraryToken(x, key) || (!x.romanization ? x.romanization === key : x.key === key));
    case 'arbitrary':
      return sounds.filter(x => fitsArbitraryToken(x, key));
    default:
      return [];
  }
}
export function fitsArbitraryToken(sound: IVowel | IConsonant, token: string) {
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

export const getAffectedSounds = (language: ILanguage, rule: IPhonologicalRule) => {
  let sounds: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] = [...language.vowels, ...language.consonants];
  let collection: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] = [];
  let allowAutoOpen = true;

  for (let ci = 0; ci < rule.tokens.length; ci++) {
    const token = rule.tokens[ci];
    const next = rule.tokens[ci + 1];
    if (token.type === '-') {
      if (collection.length === 0 && allowAutoOpen) { collection = [...sounds]; }
      if (next?.items.length > 0) {
        const _sounds: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] =
          next.items.map(item => getSounds(language, next.type, item))
                    .flat()
                    .filter(x => !!x) as (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[];
        collection = [...collection.filter(x => !_sounds.find(y => y.key === x.key))];
      }
      ci++;
    } else if (token.type === '+' || token.type.includes('collection')) {
      allowAutoOpen = false;
      const collectionToken = token.type === '+' ? next : token;
      if (collectionToken.items.length > 0) {
        const _sounds: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] =
        collectionToken.items.map(item => getSounds(language, collectionToken.type, item))
                    .flat()
                    .filter(x => !!x) as (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[];
        collection = [...collection, ..._sounds.filter(x => !collection.find(y => y.key === x.key))];
      }
      if (token.type === '+') {
        ci++;
      }
    } 
  }

  return collection;
}

export const generateRules = (phonotactics: IPhonotactic[]): IPhonologicalRule[] => {
  return phonotactics.map(tactic => {
    let type = 'custom';
    let script = tactic.script;
    const split = tactic.script.split(':').map(x => x.trim());
    if (split.length === 2) {
      type = split[0];
      script = split[1];
    }
    return {type, script};
  }).map(rule => {
    return {...rule, tokens: getTokens(rule.script)};
  }).map(rule => {
    if (rule.type === 'custom') {
      let type = rule.type;
      if (!!rule.tokens.find(x => x.type === '>')) {
        type = 'derivative';
      }
      return {...rule, type};
    }
    return rule;
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
      case '+':
        newToken = {type: '+', items: []};
        break;
      case '-':
        newToken = {type: '-', items: []};
        break;
      case '>':
        newToken = {type: '>', items: []};
        break;
      case '_':
        // Put stuff here!
        newToken = {type: '_', items: []};
        while (script[i + 1] === '_') {
          i++
        }
        break;
      case 'Ø':
        // Deletion (__ > Ø) OR Insertion (Ø > __)
        newToken = {type: 'Ø', items: []};
        break;          
      case 'σ':
        // Syllable boundary
        newToken = {type: 'σ', items: []};
        break;
      case '#':
        // Word boundary.
        newToken = {type: '#', items: []};
        break;
      case '/':
        if (script[i + 1] === ' ') {
          // This means "in the environment of"!
          newToken = {type: '/', items: []};
          break;
        }
        next = script.indexOf('/', i + 1);
        if (next !== -1) {
          newToken = {type: 'phonetic collection', items: script.slice(i + 1, next).split(',').map(x => x.trim())};
          i = next+1;
        }
        break;
      case '<':
        next = script.indexOf('>', i + 1);
        if (next !== -1) {
          newToken = {type: 'conditional collection', items: script.slice(i + 1, next).split(',').map(x => x.trim())};
          i = next+1;
        }
        break;
      case '{':
        // Seems to work as 'or'? ___{Z, #} would be 'either before Z or at word boundary.
        next = script.indexOf('}', i + 1);
        if (next !== -1) {
          newToken = {type: 'logical collection', items: script.slice(i + 1, next).split(',').map(x => x.trim())};
          i = next+1;
        }
        break;
      case '(':
        next = script.indexOf('}', i + 1);
        if (next !== -1) {
          newToken = {type: 'optional logical collection', items: script.slice(i + 1, next).split(',').map(x => x.trim())};
          i = next+1;
        }
        break;
      case '[':
        next = script.indexOf(']', i + 1);
        if (next !== -1) {
          newToken = {type: 'digraph collection', items: script.slice(i + 1, next).split(',').map(x => x.trim())};
          i = next+1;
        }
        break;
      default:
        useScratch = false;
        scratch += script[i];
        break;
    }

    if (newToken) {
      useScratch = true;
    }
    if (useScratch || i === script.length - 1) {
      const items = scratch.trim().split(',').map(x => x.trim()).filter(x => x.length > 0);
      if (items.length > 0) {
        tokens.push({type: 'arbitrary', items})
        scratch = '';  
      }
    }
    if (newToken) {
      tokens.push(newToken);
    }
  }

  return tokens;
}
