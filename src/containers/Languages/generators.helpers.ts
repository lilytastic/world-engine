import { IConsonant, ILanguage, IPhonotactic, ISound, ISoundRules, ISyllable, ITypedSound, IVowel, IWord, Manner, MANNERS, SoundPositions } from "./sounds.model";
import { VOWELS } from "./vowels";

function getRandomSound(sounds: ISound[]) {
  return sounds[Math.floor(Math.random() * sounds.length)];
}

export function transcribeWord(word: IWord) {
  return word.syllables.map(syllable => syllable.sounds.map(x => x?.romanization || x?.key || '').join('')).join('');
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
      return sounds.filter(x => !x.romanization ? x.romanization === key : x.key === key);
    case 'arbitrary':
      return sounds.filter(x => fitsArbitraryToken(x, key));
    default:
      return [];
  }
}
export function fitsArbitraryToken(sound: IVowel | IConsonant, token: string) {
  switch (token.toLowerCase()) {
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
        return sound.manner.toLowerCase() === Manner.NonSibilantFricative || sound.manner.toLowerCase() === Manner.SibilantFricative;
      }
      break;
    case 'affricates':
      if (sound.type === "consonant") {
        return sound.manner.toLowerCase() === Manner.NonSibilantAffricate || sound.manner.toLowerCase() === Manner.SibilantAffricate;
      }
      break;
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

export function getSampleWords(language: ILanguage) {
  let arr: IWord[] = [];
  if (language.vowels.length === 0 || language.consonants.length === 0) { return arr; }
  for (let i = 0; i < 30; i++) {
    arr.push(generateWord(language));
  }
  return arr;
}

export function getDefaultPositions(language: ILanguage, key: string): SoundPositions[] {
  if (!!VOWELS.find(x => x.key === key)) {
    return [SoundPositions.Close, SoundPositions.Nucleus, SoundPositions.Start];
  }
  return [SoundPositions.Close, SoundPositions.Coda, SoundPositions.Onset, SoundPositions.Start];
}

export function generateDefaultRule(language: ILanguage, sound: ISound): ISoundRules {
  const defaultPositions = getDefaultPositions(language, sound.key);
  return {positionsAllowed: defaultPositions, canCluster: false};
}

interface IToken {type: string, items: string[]}

export interface IPhonologicalRule {
  tokens: IToken[];
  type: string;
  script: string;
}

export function generateWord(language: ILanguage) {
  let length = 1 + Math.floor(Math.random() * 3);
  const morphologyMapped = language.phonology.syllableShape.toUpperCase().replace(/\(C\)/g, 'c').replace(/\(R\)/g, 'r').replace(/\(H\)/g, 'h');
  let syllables: ISyllable[] = [];
  const phonotactics: IPhonotactic[] = language.phonology.phonotactics;
  let sounds: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] = [...language.vowels, ...language.consonants];

  let onsets: ISound[] = [];
  let codas: ISound[] = [];
  const rules = generateRules(phonotactics);

  for (let ii = 0; ii < length; ii++) {
    let syllable: ISyllable = {sounds: []};
    const onsetEnd = morphologyMapped.indexOf('V');
    const codaStart = morphologyMapped.lastIndexOf('V');

    for (let i = 0; i < morphologyMapped.length; i++) {
      const token = morphologyMapped[i];
      const isWordStart = ii === 0 && i === 0;
      const isWordClose = ii === length - 1 && i ===  morphologyMapped.length - 1;
      const isOnset = i < onsetEnd;
      const isCoda = i > codaStart;

      let permitted: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] = [...sounds];

      for (let ri = 0; ri < rules.length; ri++) {
        const rule = rules[ri];
        const derivativeMarker = rule.tokens.findIndex(x => x.type === '>');

        const collection = getAffectedSounds(language, rule);

        switch (rule.type) {
          case 'onsets':
          case 'Onsets':
            if (isOnset) {
              permitted = [...collection];
            }
            break;
          case 'codas':
          case 'Codas':
            if (isCoda) {
              permitted = [...collection];
            }
            break;
          case 'custom':
            break;
          default:
            break;
        }
      }

      permitted = permitted.filter(sound => {
        switch (token) {
          case 'V':
            if (sound.type === 'consonant') {
              return false;
            }
            break;
          case 'C':
          case 'c':
            if (sound.type === 'vowel') {
              return false;
            }
            break;
          default:
            break;
        }
        
        return true;
      });

      if (permitted.length > 0) {
        const sound = getRandomSound(permitted);
        if (token === 'c' && Math.random() * 100 < 50) {
          // ...
        } else {
          syllable.sounds.push(sound);
        }
      } else {
        console.error(`No sound found for ${token}!`);
      }
    }
    syllables.push(syllable)
  }

  let word: IWord = {
    syllables
  };
  return word;
}

/*
export const listRules = (language: ILanguage) => {
  return Object.keys(language.phonology.rules).map(x => ({key: x, rules: language.phonology.rules[x]})).filter(x => !!x.rules && (!!language.vowels.find(y => y.key === x.key) || !!language.consonants.find(y => y.key === x.key)));
}
*/

export const getAffectedSounds = (language: ILanguage, rule: IPhonologicalRule) => {
  let sounds: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] = [...language.vowels, ...language.consonants];
  let collection: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] = [];

  for (let ci = 0; ci < rule.tokens.length; ci++) {
    const token = rule.tokens[ci];
    const next = rule.tokens[ci + 1];
    if (token.type === '-') {
      if (collection.length === 0) { collection = [...sounds]; }
      if (next?.items.length > 0) {
        const _sounds: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] =
          next.items.map(item => getSounds(language, next.type, item))
                    .flat()
                    .filter(x => !!x) as (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[];
        collection = [...collection.filter(x => !_sounds.find(y => y.key === x.key))];
      }
      ci++;
    } else if (token.type === '+') {
      if (next?.items.length > 0) {
        const _sounds: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] =
          next.items.map(item => getSounds(language, next.type, item))
                    .flat()
                    .filter(x => !!x) as (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[];
        collection = [...collection, ..._sounds.filter(x => !collection.find(y => y.key === x.key))];
      }
      ci++;
    } else if (token.type.includes('collection')) {
      if (token.items.length > 0) {
        const _sounds: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] =
          token.items.map(item => getSounds(language, token.type, item))
                    .flat()
                    .filter(x => !!x) as (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[];
        collection = [...collection.filter(x => !_sounds.find(y => y.key === x.key))];
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
    let tokens: IToken[] = [];
    let scratch = '';

    for (let i = 0; i < rule.script.length; i++) {
      let next = 0;
      let useScratch = true;
      switch (rule.script[i]) {
        case '+':
          tokens.push({type: '+', items: []});
          break;
        case '-':
          tokens.push({type: '-', items: []});
          break;
        case '>':
          tokens.push({type: '>', items: []});
          break;
        case '<':
          next = rule.script.indexOf('>', i + 1);
          if (next !== -1) {
            tokens.push({type: 'conditional collection', items: rule.script.slice(i + 1, next).split(',').map(x => x.trim())});
            i = next+1;
          }
          break;
        case '{':
          next = rule.script.indexOf('}', i + 1);
          if (next !== -1) {
            tokens.push({type: 'logical-disjunction collection', items: rule.script.slice(i + 1, next).split(',').map(x => x.trim())});
            i = next+1;
          }
          break;
        case '(':
          next = rule.script.indexOf('}', i + 1);
          if (next !== -1) {
            tokens.push({type: 'optional logical-disjunction collection', items: rule.script.slice(i + 1, next).split(',').map(x => x.trim())});
            i = next+1;
          }
          break;
        case '[':
          next = rule.script.indexOf(']', i + 1);
          if (next !== -1) {
            tokens.push({type: 'digraph collection', items: rule.script.slice(i + 1, next).split(',').map(x => x.trim())});
            i = next+1;
          }
          break;
        case '/':
          next = rule.script.indexOf('/', i + 1);
          if (next !== -1) {
            tokens.push({type: 'phonetic collection', items: rule.script.slice(i + 1, next).split(',').map(x => x.trim())});
            i = next+1;
          }
          break;
        default:
          useScratch = false;
          scratch += rule.script[i];
          break;
      }

      if (useScratch || i === rule.script.length - 1) {
        const items = scratch.split(',').map(x => x.trim()).filter(x => x.length > 0);
        if (items.length > 0) {
          tokens.push({type: 'arbitrary', items})
          scratch = '';  
        }
      }
    }

    return {...rule, tokens};
  });
}

export const printListExclusive = (list: any[]) => {
  if (list.length === 0) {
    return;
  }
  if (list.length === 1) {
    return list[0];
  }
  if (list.length === 2) {
    return list[0] + ' or ' + list[1];
  }
  return list.slice(0, list.length - 1).join(', ') + ', or ' + list[list.length - 1];
}

export const printAllRules = (language: ILanguage) => {
  let applicable: string[] = [];

  return language.phonology.phonotactics.map(x => x.script);
  /*
  const cantStart = listRules(language).filter(x => !x.rules.positionsAllowed.includes(SoundPositions.Start));
  const cantEnd = listRules(language).filter(x => !x.rules.positionsAllowed.includes(SoundPositions.Close));
  const nonOnset = listRules(language).filter(x => !x.rules.positionsAllowed.includes(SoundPositions.Onset) && !x.rules.positionsAllowed.includes(SoundPositions.Nucleus));
  const nonCoda = listRules(language).filter(x => !x.rules.positionsAllowed.includes(SoundPositions.Coda) && !x.rules.positionsAllowed.includes(SoundPositions.Nucleus));

  if (cantStart.length > 0) {
    applicable.push(`Words cannot start with ${printListExclusive(cantStart.map(x => `/<b>${x.key}</b>/`))}.`);
  }
  if (cantEnd.length > 0) {
    applicable.push(`Words cannot end on ${printListExclusive(cantEnd.map(x => `/<b>${x.key}</b>/`))}.`);
  }
  if (nonOnset.length > 0) {
    applicable.push(`${printListExclusive(nonOnset.map(x => `/<b>${x.key}</b>/`))} cannot be used as ${nonOnset.length === 1 ? 'an onset' : 'onsets'}.`);
  }
  if (nonCoda.length > 0) {
    applicable.push(`${printListExclusive(nonCoda.map(x => `/<b>${x.key}</b>/`))} cannot be used as ${nonCoda.length === 1 ? 'a coda' : 'codas'}.`);
  }
  */

  return applicable;
}
