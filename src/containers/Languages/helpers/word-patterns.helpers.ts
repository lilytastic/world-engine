import { ILanguage, IPhonemeClassDictionary, IWordPattern } from "../models/sounds.model";
import { getStringArray } from "./generators.helpers";
import { getRandomArrayItem, ProbabilityType } from "./logic.helpers";

export type IWordPatternDictionary = {[patternName: string]: IWordPattern[]};

export function getWordPatterns(language: ILanguage): IWordPattern[] {
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

export function wordPatternToPhonemes(phonemeClasses: IPhonemeClassDictionary, wordPattern: IWordPattern, mapper?: (phoneme: string) => string | undefined) {
  // Expand every uppercase letter
  const { pattern } = wordPattern;
  let tokens = pattern; // Note -- these are syllables, whatever the tokens are initially.
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (token === token.toUpperCase() && phonemeClasses[token]) {
      const item = getRandomArrayItem(phonemeClasses[token].tokens, ProbabilityType.FastDropoff);
      tokens = [...tokens.slice(0, i), ...getStringArray(mapper?.(item) ?? item), ...tokens.slice(i + 1)];
      i -= 1;
    }
  }
  return tokens;
}