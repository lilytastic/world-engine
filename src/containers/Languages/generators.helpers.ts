import { getAffectedSounds, getTokens, IPhonologicalRule, IPhonotactic } from "./phonology.helpers";
import { ILanguage, ISound, ISoundRules, ISyllable, ITypedSound, IWord, SoundPositions, TypedSound } from "./sounds.model";
import { VOWELS } from "./vowels";

function getRandomSound(sounds: ISound[]) {
  return sounds[Math.floor(Math.random() * sounds.length)];
}

export function transcribeWord(word: IWord) {
  return word.syllables.map(syllable => syllable.sounds.map(x => x?.romanization || x?.phoneme || '').join('')).join('');
}

export function getSampleWords(language: ILanguage) {
  let arr: IWord[] = [];
  if (language.vowels.length === 0 || language.consonants.length === 0) { return arr; }
  const rules = generateRules(language.phonology.phonotactics);
  for (let i = 0; i < 30; i++) {
    arr.push(generateWord(language, rules));
  }
  return arr;
}

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

export function generateWord(language: ILanguage, rules: IPhonologicalRule[]) {
  let length = 1 + Math.floor(Math.random() * 3);
  const morphologyMapped =
    language.phonology.syllableShape.toUpperCase()
                                    .replace(/ /g, '')
                                    //.replace(/\(>\)/g, '⪫')
                                    //.replace(/\(<\)/g, '⪪')
                                    .replace(/\(C\)/g, 'c')
                                    .replace(/\(R\)/g, 'r')
                                    .replace(/\(H\)/g, 'h');
  let syllables: ISyllable[] = [];
  const phonotactics: IPhonotactic[] = language.phonology.phonotactics;
  let sounds: TypedSound[] = [...language.vowels, ...language.consonants];

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

      let permitted: TypedSound[] = [...sounds];

      for (let ri = 0; ri < rules.length; ri++) {
        const rule = rules[ri];
        const derivativeMarker = rule.tokens.findIndex(x => x.type === '>');
        const environmentMarker = rule.tokens.findIndex(x => x.type === '/');

        const collection = getAffectedSounds(language, rule.tokens);

        if (environmentMarker) {
          let isApplicable = false;
          const env = rule.tokens.slice(environmentMarker + 1);
          // console.log('checking environment...', env);
          if (isOnset && env.find(x => !!x.items.find(x => x.toLowerCase() === 'onsets'))) { isApplicable = true; }
          if (isCoda && env.find(x => !!x.items.find(x => x.toLowerCase() === 'cods'))) { isApplicable = true; }

          if (isApplicable) {
            permitted = [...collection];
          }
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
  return language.phonology.phonotactics.map(x => `${x.description ? x.description + ': ' : ''}${x.script}`);
}
