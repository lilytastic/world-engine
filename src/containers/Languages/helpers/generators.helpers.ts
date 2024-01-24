import {
  EMPTY_ENVIRONMENT,
  extractPhonemeStringArray,
  filterForbiddenCombinations,
  filterSoundsFromPhonemeStringArray,
  getRandomArrayItem,
  insertString,
  processToken,
  transcribePhonemeStringArray
} from "./logic.helpers";
import { getWordPatternDictionary } from "./word-patterns.helpers";
import { PhonologicalToken, getPhonemeClassDictionary } from "./phonology.helpers";
import { ILanguage, IWord } from "../models/language.model";

// TODO: Try to implement some of https://github.com/conlang-software-dev/Logopoeist
// TODO: Also this https://www.vulgarlang.com/sound-changes

export function generateWord(language: ILanguage, type = 'word'): IWord {
  const wordPatterns = getWordPatternDictionary(language)[type];
  
  const appropriatePatterns = filterForbiddenCombinations(EMPTY_ENVIRONMENT, language, wordPatterns.map(x => x.pattern.join('')));
  const wordPattern = getRandomArrayItem(appropriatePatterns);
  
  const processedWordStr = processWordPattern(language, wordPattern);

  const phonemes = extractPhonemeStringArray(processedWordStr);
  const transcription = transcribePhonemeStringArray(phonemes);
  const sounds = filterSoundsFromPhonemeStringArray(phonemes);

  return { transcription, sounds };
}

export function processWordPattern(language: ILanguage, env: string): string {
  let environment = env;
  const phonemeClasses = getPhonemeClassDictionary(language);
  let timesLooped = 0;

  for (let pos = 0; pos < environment.length; pos++) {
    if (timesLooped > 20) {
      return processWordPattern(language, env); // Go back and start again to prevent an infinite loop.
    }

    const insert = processToken(language, phonemeClasses, { environment, position: pos });
    if (!!insert) {
      environment = insertString(environment, insert.token, pos);
      if (insert.type === PhonologicalToken.ClassToken) { pos -= 1; timesLooped++; }
    } else {
      environment = env;
      pos = 0;
      timesLooped++;
    }
  }
  return environment;
}
