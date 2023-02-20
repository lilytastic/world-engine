import { ILanguage, IPhonotactic, ISound, ISoundRules, ISyllable, IWord, SoundPositions } from "./sounds.model";
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
  const morphologyMapped = language.phonology.syllableShape.toUpperCase().replace(/\(C\)/g, 'c');
  let syllables: ISyllable[] = [];

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
      let sounds = [...language.vowels, ...language.consonants];

      sounds = sounds.filter(sound => {
        const phonotactics: IPhonotactic[] = language.phonology.phonotactics;
        
        /*
        let rules = language.phonology.phonotactics[sound.key];
        if (!rules) {
          rules = generateDefaultRule(language, sound);
          if (sound.type === 'vowel') {
            rules = {
              canCluster: true,
              positionsAllowed: [SoundPositions.Close, SoundPositions.Nucleus, SoundPositions.Start]
            };                
          } else {
            rules = {
              canCluster: true,
              positionsAllowed: [SoundPositions.Close, SoundPositions.Coda, SoundPositions.Onset, SoundPositions.Start]
            };  
          }
        }

        if (isWordStart) {
          if (!rules.positionsAllowed.includes(SoundPositions.Start)) {
            return false;
          }
        }
        if (isWordClose) {
          if (!rules.positionsAllowed.includes(SoundPositions.Close)) {
            return false;
          }
        }

        // TODO: The H or "medial" token, usually liquids.
        // TODO: The R for 'resonant', or 'sonorant'.
        // TODO: < or > to include whether the next sound should either rise or fall in tone.

        if (token === 'V') {
          if (!rules.positionsAllowed.includes(SoundPositions.Nucleus)) {
            return false;
          }
        } else {
          if (rules.positionsAllowed.includes(SoundPositions.Nucleus)) {
            return false;
          }

          if (isOnset) {
            if (!rules.positionsAllowed.includes(SoundPositions.Onset) && !(isWordStart && rules.positionsAllowed.includes(SoundPositions.Start))) {
              return false;
            }
          } 
          
          if (isCoda) {
            if (!rules.positionsAllowed.includes(SoundPositions.Coda) && !(isWordClose && rules.positionsAllowed.includes(SoundPositions.Close))) {
              return false;
            }
          }
        }
        */
        
        return true;
      });

      if (sounds.length > 0) {
        const sound = getRandomSound(sounds);
        if (token === 'c' && Math.random() * 100 < 50) {
          // ...
        } else {
          syllable.sounds.push(sound);
        }
      } else {
        console.error('No sound found!');
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
