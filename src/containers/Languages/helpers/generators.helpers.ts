import { TypedSound, IPhonemeClass, IWordPattern } from "../models/sounds.model";
import { getWordPatternDictionary } from "./word-patterns.helpers";
import { ProbabilityType, getRandomArrayItem } from "./logic.helpers";
import { ILanguage, IWord } from "../models/language.model";
import { IPhonologicalToken } from "../models/phonology.model";
import { CONSONANTS } from "../data/consonants";
import { VOWELS } from "../data/vowels";

// TODO: Try to implement some of https://github.com/conlang-software-dev/Logopoeist
// TODO: Also this https://www.vulgarlang.com/sound-changes

export function checkForToken(tokens: IPhonologicalToken[], key: string) {
  return tokens.find(x => !!x.items.find(x => x.toLowerCase() === key));
}

export function getStringArray(str: string) {
  let arr: string[] = [];
  for (let i = 0; i < str.length; i++) {
    arr.push(str[i]);
  }
  return arr.filter(x => x !== ' ');
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

export function getPhonemeClassDictionary(language: ILanguage) {
  const classes = getPhonemeClasses(language);
  const dictionary: {[className: string]: IPhonemeClass} = {};
  classes.forEach(c => {
    dictionary[c.className] = c;
  });

  return dictionary;
}

export function getSampleWordsV2(language: ILanguage) {
  let arr: IWord[] = [];
  for (let i = 0; i < 30; i++) {
    arr.push(generateWordV2(language));
  }
  return arr;
}

export function generateWordV2(language: ILanguage): IWord {
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

export type Syllable = (TypedSound | string)[];

export interface IPositioning {
  data: any;
  index: number;
}

export function wordPatternToSyllables(language: ILanguage, wordPattern: IWordPattern): Syllable[] {
  // Expand every uppercase letter
  const { pattern } = wordPattern;
  let syllables: Syllable[] = [];

  for (let i = 0; i < pattern.length; i++) {
    syllables.push(syllableToPhonemes(pattern[i], language));
  }

  return syllables;
}

export function syllableToPhonemes(syllable: string, language: ILanguage): Syllable {
  const ALL_PHONEMES = [...CONSONANTS, ...VOWELS];
  const phonemeClasses = getPhonemeClassDictionary(language);
  const phonemes = [];

  let timesLooped = 0;

  for (let i = 0; i < syllable.length; i++) {
    const token = syllable[i];
    const phoneme = ALL_PHONEMES.find(x => x.phoneme === token);

    if (token === token.toUpperCase() && phonemeClasses[token] && timesLooped < 10) {
      
      // This is, in fact, a class! Huzzah! Get all the tokens.
      const classTokens = filterForbiddenCombinations(language, phonemeClasses[token].tokens);
      // TODO: Filter the list for anything not permitted.
      // console.log('filter me', phonemeClasses[token].tokens, language.phonology.forbiddenCombinations);
      
      const item = getRandomArrayItem(classTokens, language.phonology.dropoffRate || ProbabilityType.MediumDropoff);
      // Item is now either a random phoneme fitting the class, or another class token, or nothing.
      
      syllable = syllable.slice(0, i) + item + syllable.slice(i + 1);
      i -= 1;
      timesLooped++;
    } else if (phoneme) {
      phonemes.push(phoneme);
      timesLooped = 0;
    } else {
      // This isn't a proper token, so just add it to the word. Might be an apostrophe or some other crap.
      phonemes.push(token);
    }
  }
  return phonemes;
}

export function filterForbiddenCombinations(language: ILanguage, tokens: string[]): string[] {
  if (!language.phonology.forbiddenCombinations) {
    return tokens;
  }
  // console.log(positioning);
  return tokens;
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