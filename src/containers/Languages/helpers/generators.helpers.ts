import { generateRules } from "./phonology.helpers";
import { TypedSound, IPhonemeClass } from "../models/sounds.model";
import { VOWELS } from "../data/vowels";
import { CONSONANTS } from "../data/consonants";
import { getAffectedSounds, getSoundByPhoneme } from "./sounds.helpers";
import { getWordPatternDictionary, wordPatternToPhonemes, wordPatternToPhonemesV2 } from "./word-patterns.helpers";
import { getRandomArrayItem } from "./logic.helpers";
import { ILanguage, ISyllable, IWord } from "../models/language.model";
import { IPhonologicalRule, IPhonologicalToken } from "../models/phonology.model";

// TODO: Try to implement some of https://github.com/conlang-software-dev/Logopoeist
// TODO: Also this https://www.vulgarlang.com/sound-changes


export function transcribeWord(language: ILanguage, word: IWord) {
  return word.syllables.map(syllable => 
    syllable.sounds.map(phoneme => 
      [...VOWELS, ...CONSONANTS].find(sound => sound.phoneme === phoneme)
    ).map(x => 
      x?.romanization || x?.phoneme || ''
    )
  ).flat().join('');
}
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


export function getSampleWords(language: ILanguage) {
  let arr: IWord[] = [];
  if (language.vowels.length === 0 || language.consonants.length === 0) { return arr; }

  const rules = generateRules(language.phonology.phonotactics);
  //console.log('rules', rules);
  for (let i = 0; i < 30; i++) {
    arr.push(generateWord(language, rules));
    //arr.push(generateWordV2(language, phonemeClasses, wordPatterns));
  }
  return arr;
}

export function getSampleWordsV2(language: ILanguage) {
  let arr: string[] = [];
  // console.log('language', language);
  // console.log('phonemeClasses', phonemeClasses);
  // console.log('wordPatterns', wordPatterns);
  for (let i = 0; i < 30; i++) {
    arr.push(generateWordV2(language));
  }
  return arr;
}

export function generateWordV2(language: ILanguage) {
  const wordPatterns = getWordPatternDictionary(language);
  const wordPattern = getRandomArrayItem(wordPatterns['word']);
  const tokens = wordPatternToPhonemesV2(
    language,
    wordPattern
  );
  // console.log('word', tokens);
  return tokens.map(x => {
    const sound = x as TypedSound;
    if (!!sound.phoneme) {
      return sound.romanization || sound.phoneme
    } else {
      return x;
    }
  }).join('');
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
            /*
            if (env[selfIndex + 1].items.includes('C') && morphologyMapped[i + 1] === 'C') {
              isApplicable = true;
              // console.log('IT DO!');
            }
            */ 
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
