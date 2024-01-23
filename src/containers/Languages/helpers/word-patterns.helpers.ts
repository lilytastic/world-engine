import { CONSONANTS } from "../data/consonants";
import { VOWELS } from "../data/vowels";
import { ILanguage, ISyllable } from "../models/language.model";
import { IWordPattern, TypedSound } from "../models/sounds.model";
import { getPhonemeClassDictionary, getStringArray } from "./generators.helpers";
import { getRandomArrayItem, ProbabilityType } from "./logic.helpers";

export type IWordPatternDictionary = {[patternName: string]: IWordPattern[]};

export function getWordPatterns(language: ILanguage): IWordPattern[] {
  if (!language.phonology.wordPatterns) { return []; }
  const tokens = language.phonology.wordPatterns.split('\n');
  let wordPatterns: IWordPattern[] = [];
  
  let patternName = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.trim() === '') { continue; }
    const definitionIndex = token.indexOf('=');
    if (definitionIndex === -1) {
      wordPatterns.push({
        patternName: patternName || 'word',
        pattern: getStringArray(token.trim())
      });
    } else {
      patternName = token.slice(0, definitionIndex - 1).trim();
    }
  }

  return wordPatterns;
}

export function getWordPatternDictionary(language: ILanguage) {
  const wordPatterns = getWordPatterns(language);
  const dictionary: {[className: string]: IWordPattern[]} = {};
  wordPatterns.forEach(c => {
    const index = c.patternName;
    const existing = dictionary[index];
    dictionary[index] = [...(existing || []), c];
  });

  return dictionary;
}

export function wordPatternToPhonemesV2(language: ILanguage, wordPattern: IWordPattern): (TypedSound | string)[] {
  // Expand every uppercase letter
  const { pattern } = wordPattern;
  let syllables = pattern; // Note -- these are syllables, whatever the tokens are initially.
  let phonemes: (TypedSound | string)[] = [];

  for (let i = 0; i < syllables.length; i++) {
    phonemes.push(...syllableToPhonemes(syllables[i], language));
  }

  return phonemes;
}

export function syllableToPhonemes(_syllable: string, language: ILanguage): (TypedSound | string)[] {
  let syllable = _syllable;
  const ALL_PHONEMES = [...CONSONANTS, ...VOWELS];
  const phonemeClasses = getPhonemeClassDictionary(language);
  const phonemes = [];
  const phoneme = ALL_PHONEMES.find(x => x.phoneme === syllable);

  let timesLooped = 0;

  for (let i = 0; i < syllable.length; i++) {
    const token = syllable[i];
    if (token === token.toUpperCase() && phonemeClasses[token] && timesLooped < 10) {
      // This is, in fact, a class token! Huzzah!
      const item = getRandomArrayItem(phonemeClasses[token].tokens, language.phonology.dropoffRate || ProbabilityType.MediumDropoff);
      // Item is now a random phoneme fitting the class.
      syllable = (syllable.slice(0, i) + item + syllable.slice(i + 1));
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

  /*
  let timesLooped = 0;
  for (let i = 0; i < wordPatternTokens.length; i++) {
    let token = wordPatternTokens[i];

    if (token === token.toUpperCase() && phonemeClasses[token]) {
      // This is, in fact, a class token! Huzzah!
      const item = getRandomArrayItem(phonemeClasses[token].tokens, language.phonology.dropoffRate || ProbabilityType.FastDropoff);
      // Item is now a random phoneme fitting the class.
      const phoneme = ALL_PHONEMES.find(x => x.phoneme === token);

      if (phoneme) {
        phonemes.push(phoneme);
        timesLooped = 0;
      }
      else if (timesLooped < 10) {
        wordPatternTokens = [...wordPatternTokens.slice(0, i), ...getStringArray(item), ...wordPatternTokens.slice(i + 1)];
        i -= 1; // Go back to deal with the new tokens
        timesLooped++;
      }
    } else {
      // This isn't a proper token, so just add it to the word. Might be an apostrophe or some other crap.
      phonemes.push(token);
    }
  }
  */
  // console.log(phonemes, wordPatternTokens);

