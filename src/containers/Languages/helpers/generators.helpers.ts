import {
  EMPTY_ENVIRONMENT,
  extractPhonemeStringArray,
  filterForbiddenCombinations,
  filterSoundsFromPhonemeStringArray,
  getRandomArrayItem,
  insertString,
  fillToken,
  transcribePhonemeStringArray,
  StringEnvironment
} from "./logic.helpers";
import { getWordPatternDictionary } from "./word-patterns.helpers";
import { PhonologicalTokenType, applySoundChanges, getPhonemeClassDictionary } from "./phonology.helpers";
import { ILanguage, IWord } from "../models/language.model";

// TODO: Try to implement some of https://github.com/conlang-software-dev/Logopoeist
// TODO: Also this https://www.vulgarlang.com/sound-changes

export function generateWord(language: ILanguage, type = 'word'): IWord {
  const wordPatterns = getWordPatternDictionary(language)[type];
  
  const appropriatePatterns = filterForbiddenCombinations(EMPTY_ENVIRONMENT, language, wordPatterns.map(x => x.pattern.join('')));
  const wordPattern = getRandomArrayItem(appropriatePatterns);
  
  const filledWordStr = applySoundChanges(language, fillWordPattern(language, wordPattern));

  const phonemes = extractPhonemeStringArray(filledWordStr);
  const transcription = transcribePhonemeStringArray(phonemes);
  const sounds = filterSoundsFromPhonemeStringArray(phonemes);

  return { transcription, sounds };
}


export function fillWordPattern(language: ILanguage, wordPattern: string): string {
  let environment = wordPattern;
  const phonemeClasses = getPhonemeClassDictionary(language);

  let timesLooped = 0;
  for (let position = 0; position < environment.length; position++) {
    if (timesLooped > 20) {
      return fillWordPattern(language, wordPattern); // Go back and start again to prevent an infinite loop.
    }

    const env: StringEnvironment = { environment, position };

    let insert = fillToken(language, phonemeClasses, env);
    if (!!insert) {
      environment = insertString(environment, insert.token, position);
      if (insert.type === PhonologicalTokenType.ClassToken) {
        position -= 1;
        timesLooped++;
      }
    } else {
      environment = wordPattern;
      position = 0;
      timesLooped++;
    }
  }
  return environment;
}
