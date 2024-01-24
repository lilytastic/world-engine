import { CONSONANTS } from "../data/consonants";
import { VOWELS } from "../data/vowels";
import { TypedSound } from "../models/sounds.model";

export type Syllable = (TypedSound | string)[];
export const ALL_PHONEMES = [...CONSONANTS, ...VOWELS];

/*
export function generateWordV1(language: ILanguage): IWord {
  const wordPatterns = getWordPatternDictionary(language);
  const wordPattern = getRandomArrayItem(wordPatterns['word']);
  const syllables = wordPatternToSyllables(
    language,
    wordPattern
  );
  const phonemes = syllables.flat();

  const transcription = phonemes.map(x => {
    const sound = x as TypedSound;
    if (!!sound.phoneme) {
      return sound.romanization || sound.phoneme
    } else {
      return x;
    }
  }).join('');

  const sounds = phonemes.filter(x => {
    const sound = x as TypedSound;
    if (!!sound.phoneme) {
      return true;
    }
    return false;
  }) as TypedSound[];

  return { transcription, sounds };
}

export function syllablesToString(syllables: Syllable[], includeUnknown: boolean = false) {
  return syllables.map(syllable => syllable.map(x => (x as TypedSound).phoneme || (includeUnknown ? x : '')).filter(x => x !== '').join('')).join('σ');
}
// σ

export function wordPatternToSyllables(language: ILanguage, wordPattern: IWordPattern): Syllable[] {
  // Expand every uppercase letter
  const { pattern } = wordPattern;
  let syllables: Syllable[] = [];

  for (let i = 0; i < pattern.length; i++) {
    let prev = syllablesToString(syllables);
    if (syllables.length > 0) { prev += 'σ'; }
    let future = pattern.slice(i + 1).join('');
    if (future.length > 0) {
      future = 'σ' + future;
    }
    syllables.push(syllableToPhonemes(pattern[i], language, `#${prev}_${future}#`));
  }

  return syllables;
}

export function syllableToPhonemes(syllable: string, language: ILanguage, environment: string): Syllable {
  const phonemeClasses = getPhonemeClassDictionary(language);
  const phonemes = [];
  let env = environment;

  let timesLooped = 0;

  for (let i = 0; i < syllable.length; i++) {
    const token = syllable[i];
    //console.log(env);
    const phoneme = ALL_PHONEMES.find(x => x.phoneme === token);

    if (token === token.toUpperCase() && phonemeClasses[token] && timesLooped < 10) {
      
      // This is, in fact, a class! Huzzah! Get all the tokens.
      const index = env.indexOf('_');
      if (env[index + 1] !== '#') {
        env = `${env.slice(0, index)}_${env.slice(index + 2)}`;
      }
      const classTokens = filterForbiddenCombinations(env, language, phonemeClasses[token].tokens);
      // TODO: Filter the list for anything not permitted.
      // console.log('filter me', phonemeClasses[token].tokens, language.phonology.forbiddenCombinations);
      
      const item = getRandomArrayItem(classTokens, language.phonology.dropoffRate || ProbabilityType.MediumDropoff);
      // Item is now either a random phoneme fitting the class, or another class token, or nothing.
      if (item) {
        syllable = syllable.slice(0, i) + item + syllable.slice(i + 1);
        if (item.toUpperCase() === item && phonemeClasses[token]) {
          const index = env.indexOf('_');
          env = `${env.slice(0, index)}_${item}${env.slice(index + 1)}`;
          //console.log(env, 'adding', item);
        }
        i -= 1;
        timesLooped++;
      } else {
        console.error('no options for ', phonemeClasses[token].tokens, env);
      }
    } else if (phoneme) {
      phonemes.push(phoneme);
      const index = env.indexOf('_');
      if (env[index + 1] !== '#') {
        env = `${env.slice(0, index)}${phoneme.phoneme}_${env.slice(index + 2)}`;
      }
      //console.log(env, 'adding phoneme', phoneme.phoneme);
      timesLooped = 0;
    } else if (token) {
      // This isn't a proper token, so just add it to the word. Might be an apostrophe or some other crap.
      phonemes.push(token);
    }
  }

  // console.log(env);
  return phonemes;
}

/*
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
      
      //if (token.toLowerCase() === 'c') { permitted = [...language.consonants]; }
      //else if (token.toLowerCase() === 'v') { permitted = [...language.vowels]; }

      // First, iterate through our rules and see which sounds we're allowed to use...
      for (let ri = 0; ri < rules.length; ri++) {
        const rule = rules[ri];
        const derivationMarker = rule.tokens.findIndex(x => x.type === '>');
        const environmentMarker = rule.tokens.findIndex(x => x.type === '/');

        if (derivationMarker !== -1) {
          // If it's a derivation, run it on the next pass.
          continue;
        }
        if (environmentMarker) {
          const collection = getAffectedSounds(language, rule.tokens.slice(0, environmentMarker));

          const env = rule.tokens.slice(environmentMarker + 1);
          const selfIndex = env.findIndex(x => x.type === '_');

          let isApplicable = false;
          // console.log('checking environment...', env);
          if (isOnset && checkForToken(env, 'onset')) { isApplicable = true; }
          if (isCoda && checkForToken(env, 'coda')) { isApplicable = true; }
          if (token === 'V' && checkForToken(env, 'nucleus')) { isApplicable = true; }
          if (isWordClose && checkForToken(env, 'word-finish')) { isApplicable = true; }
          if (isWordStart && checkForToken(env, 'word-start')) { isApplicable = true; }
          for (let mi = 0; mi < env.length; mi++) {
            if (selfIndex !== -1) {
              let offsetFromSelf = selfIndex - mi;
              // console.log('check', morphologyMapped[i + offsetFromSelf], env[mi]);
              if (env[mi] && !!env[mi].items.find(item => morphologyMapped[i - offsetFromSelf] === item)) {
                // console.log(rule, collection, env[mi], morphologyMapped[i]);
                isApplicable = true;
              }
            }
          }
          //isRuleApplicable({syllableShape: morphologyMapped, letter: i}, env);

          if (isApplicable) {
            //console.log('applying rule', rule, collection);
            permitted = [...permitted, ...collection.permitted];
            forbidden = [...forbidden, ...collection.forbidden];
          }
        }
      }
      //console.log(token, 'final sound set', permitted, forbidden);

      permitted = permitted.filter(sound => {

        if (!!forbidden.find(forbiddenSound => forbiddenSound.phoneme === sound.phoneme)) {
          // VERBOTEN!
          return false;
        }
        
        return true;
      });

      if (permitted.length > 0) {
        const sound = getRandomArrayItem(permitted);
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
*/

export function filterForbiddenCombinationsV1(environment: string, forbiddenCombinationsStr: string, collection: string[]): string[] {

  const forbiddenCombinations = forbiddenCombinationsStr.split(' ');

  // Count syllable boundaries as word boundaries
  /*
  for (let i = 0; i < forbiddenCombinations.length; i++) {
    if (forbiddenCombinations[i].includes('σ')) {
      forbiddenCombinations.push(forbiddenCombinations[i].replace('σ', '#'));
    }
  }
  */

  const allowed = collection.filter(token => {
    for (let i = 0; i < forbiddenCombinations.length; i++) {
      const forbiddenCombination = forbiddenCombinations[i];
      const includes = environment.replace('_', token).includes(forbiddenCombination);
      // const includesWithoutBoundaries = environment.replace('_', token).replace('/σ/g', '').replace('/#/g', '').includes(forbiddenCombination);
      const includesWithoutBoundaries = environment.replace('_', token).replace(/#/g, '').includes(forbiddenCombination);
      const test = forbiddenCombination.length > 0
                  && (includes || includesWithoutBoundaries);
                  // TODO: 
      if (test) {
        //console.log('testing', environment.replace('_', token), `${test} (${forbiddenCombination})`);
        return false;
      }
    }
    //console.log('testing', environment.replace('_', token), `OK!`);
    return true;
  });
  // console.log(environment, forbiddenCombinations, allowed);
  return allowed;
}
