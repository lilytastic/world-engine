import {
  EMPTY_ENVIRONMENT,
  extractPhonemeStringArray,
  filterForbiddenCombinations,
  filterSoundsFromPhonemeStringArray,
  getRandomArrayItem,
  insertString,
  fillToken,
  transcribePhonemeStringArray,
  StringEnvironment,
  PhonemeStringArray,
  splitVariableToken
} from "./logic.helpers";
import { getWordPatternDictionary } from "./word-patterns.helpers";
import { PhonologicalTokenType, applySoundChanges, getPhonemeClassDictionary } from "./phonology.helpers";
import { ILanguage, IWord } from "../models/language.model";
import { TypedSound } from "../models/sounds.model";


// TODO: Try to implement some of https://github.com/conlang-software-dev/Logopoeist
// TODO: Also this https://www.vulgarlang.com/sound-changes


export function generateWord(language: ILanguage, type = 'word'): IWord {
  const wordPatterns = getWordPatternDictionary(language)[type];
  
  const appropriatePatterns = filterForbiddenCombinations(EMPTY_ENVIRONMENT, language, wordPatterns.map(x => x.pattern.join('')));
  const wordPattern = getRandomArrayItem(appropriatePatterns);
  
  const filledWordStr = applySoundChanges(language, fillWordPattern(language, wordPattern));

  const phonemes = extractPhonemeStringArray(filledWordStr);

  const transcription = spellPhonemeStringArray(language, phonemes) // transcribePhonemeStringArray(phonemes);

  const sounds = filterSoundsFromPhonemeStringArray(phonemes);

  return { transcription, sounds };
}

export function spellPhonemeStringArray(language: ILanguage, phonemes: PhonemeStringArray) {
  let environment = phonemes.map(str => {
    const sound = (str as TypedSound);
    if (sound.phoneme) {
      return sound.phoneme;
    }
    return str;
  }).join('');

  // console.log(language.spelling);
  if (language.spelling) {
    const spellingRules = language.spelling?.spellingRules.split('\n');
    // console.log(spellingRules);
    spellingRules.forEach(spellingRule => {
      spellingRule = spellingRule.replace(/#/g, '\\b');
      const [rule, inEnvironmentOf] = spellingRule.split('/').map(x => x.trim());
      const [target, result] = rule.split('>').map(x => x.trim());

      let matchFor = `(${splitVariableToken(target).join('|')})`;
      const test = inEnvironmentOf
        ? new RegExp(inEnvironmentOf.replace('_', matchFor), 'g')
        : new RegExp(matchFor, 'g');
      const matches: RegExpMatchArray | null = environment.match(test);
      if (matches) {
        if (inEnvironmentOf) {
          console.log(matches, inEnvironmentOf.replace('_', matchFor), environment);
        } else {
          console.log(matches, environment);
        }
      }
      if (matches) {
        // console.log(environment, target, inEnvironmentOf, matchFor, environment.match(new RegExp(matchFor, 'g')), matches, '>', result);
        // console.log(matches.index);
        matches.forEach((match: string) => {
          const realTarget = match.match(matchFor)?.[0];
          if (!realTarget) { console.error(`couldn't find a real target`, match, matchFor); return; }
          const index = environment.indexOf(realTarget, environment.indexOf(match));
          // console.log(environment, match, result, realTarget, index);
          const finalResult = getRandomArrayItem(splitVariableToken(result));
          environment = insertString(environment, finalResult, index, realTarget.length - 1);
        });
      }
      // environment = environment.replace(new RegExp(target, 'g'), result);
    });
  }
  return environment;
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
