import { ILanguage } from "../models/language.model";
import { IWordPattern } from "../models/sounds.model";
import { getStringArray } from "./logic.helpers";

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
