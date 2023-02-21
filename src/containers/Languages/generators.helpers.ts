import { generateRules, getAffectedSounds, IPhonotactic } from "./phonology.helpers";
import { ILanguage, ISound, ISoundRules, ISyllable, ITypedSound, IWord, SoundPositions } from "./sounds.model";
import { VOWELS } from "./vowels";

function getRandomSound(sounds: ISound[]) {
  return sounds[Math.floor(Math.random() * sounds.length)];
}

export function transcribeWord(word: IWord) {
  return word.syllables.map(syllable => syllable.sounds.map(x => x?.romanization || x?.key || '').join('')).join('');
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


export function generateWord(language: ILanguage) {
  let length = 1 + Math.floor(Math.random() * 3);
  const morphologyMapped =
    language.phonology.syllableShape.toUpperCase()
                                    .replace(/ /g, '')
                                    .replace(/\(>\)/g, '⪫')
                                    .replace(/\(<\)/g, '⪪')
                                    .replace(/\(C\)/g, 'c')
                                    .replace(/\(R\)/g, 'r')
                                    .replace(/\(H\)/g, 'h');
  let syllables: ISyllable[] = [];
  const phonotactics: IPhonotactic[] = language.phonology.phonotactics;
  let sounds: (ITypedSound<'vowel'> | ITypedSound<'consonant'>)[] = [...language.vowels, ...language.consonants];

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
          case '<':
            return false;
          case '>':
            return false;
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
      } else if (token !== '<' && token !== '>') {
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
}
