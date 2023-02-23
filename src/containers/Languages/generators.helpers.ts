import { CONSONANTS } from "./consonants";
import { getAffectedSounds, getTokens, IPhonologicalRule, IPhonologicalToken, IPhonotactic } from "./phonology.helpers";
import { ILanguage, ISound, ISoundRules, ISyllable, ITypedSound, IWord, SoundPositions, TypedSound } from "./sounds.model";
import { VOWELS } from "./vowels";

function getRandomSound(sounds: ISound[]) {
  return sounds[Math.floor(Math.random() * sounds.length)];
}

export function transcribeWord(language: ILanguage, word: IWord) {
  return word.syllables.map(syllable => 
    syllable.sounds.map(phoneme => 
      [...VOWELS, ...CONSONANTS].find(sound => sound.phoneme === phoneme)
    ).map(x => 
      x?.romanization || x?.phoneme || ''
    )
  ).flat().join('');
}

export function getSampleWords(language: ILanguage) {
  let arr: IWord[] = [];
  if (language.vowels.length === 0 || language.consonants.length === 0) { return arr; }
  const rules = generateRules(language.phonology.phonotactics);
  console.log('rules', rules);
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

export function checkForToken(tokens: IPhonologicalToken[], key: string) {
  return tokens.find(x => !!x.items.find(x => x.toLowerCase() === key));
}

export function generateWord(language: ILanguage, rules: IPhonologicalRule[]) {
  let length = 1 + Math.floor(Math.random() * 3);
  const splitSyllableShape = language.phonology.syllableShape.split('\n');
  let syllables: ISyllable[] = [];

  for (let ii = 0; ii < length; ii++) {
    const syllableShape = splitSyllableShape[Math.floor(Math.random() * splitSyllableShape.length)];
    const morphologyMapped =
      syllableShape.toUpperCase()
                  .replace(/ /g, '')
                  //.replace(/\(>\)/g, '⪫')
                  //.replace(/\(<\)/g, '⪪')
                  .replace(/\(C\)/g, 'c')
                  .replace(/\(R\)/g, 'r')
                  .replace(/\(H\)/g, 'h');
    let syllable: ISyllable = {sounds: []};
    const onsetEnd = morphologyMapped.indexOf('V');
    const codaStart = morphologyMapped.lastIndexOf('V');

    for (let i = 0; i < morphologyMapped.length; i++) {
      const token = morphologyMapped[i];
      const isWordStart = ii === 0 && i === 0;
      const isWordClose = ii === length - 1 && i ===  morphologyMapped.length - 1;
      const isOnset = i < onsetEnd;
      const isCoda = i > codaStart;

      let permitted: TypedSound[] = [];
      let forbidden: TypedSound[] = [];
      if (token.toLowerCase() === 'c') { permitted = [...language.consonants]; }
      else if (token.toLowerCase() === 'v') { permitted = [...language.vowels]; }

      // First, iterate through our rules and see which sounds we're allowed to use...
      for (let ri = 0; ri < rules.length; ri++) {
        const rule = rules[ri];
        const derivativeMarker = rule.tokens.findIndex(x => x.type === '>');
        const environmentMarker = rule.tokens.findIndex(x => x.type === '/');

        if (environmentMarker) {
          const collection = getAffectedSounds(language, rule.tokens.slice(0, environmentMarker));

          const env = rule.tokens.slice(environmentMarker + 1);
          const selfIndex = env.findIndex(x => x.type === '_');

          let isApplicable = false;
          // console.log('checking environment...', env);
          if (isOnset && checkForToken(env, 'onset')) { isApplicable = true; }
          if (isCoda && checkForToken(env, 'coda')) { isApplicable = true; }
          if (isWordClose && checkForToken(env, 'word-finish')) { isApplicable = true; }
          if (isWordStart && checkForToken(env, 'word-start')) { isApplicable = true; }
          if (selfIndex !== -1) {
            if (env[selfIndex + 1].items.includes('C') && morphologyMapped[i + 1] === 'C') {
              isApplicable = true;
              // console.log('IT DO!');
            }
          }
          //isRuleApplicable({syllableShape: morphologyMapped, letter: i}, env);

          if (isApplicable) {
            // console.log('applying rule', rule, collection);
            permitted = [...permitted, ...collection.permitted];
            forbidden = [...forbidden, ...collection.forbidden];
          }
        }
      }

      permitted = permitted.filter(sound => {

        if (!!forbidden.find(forbiddenSound => forbiddenSound.phoneme === sound.phoneme)) {
          // VERBOTEN!
          return false;
        }

        switch (token) {
          case '<':
            return false;
          case '>':
            return false;
          case 'V':
          case 'v':
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
          syllable.sounds.push(sound.phoneme);
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
