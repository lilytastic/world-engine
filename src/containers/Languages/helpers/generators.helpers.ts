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
  markPositionInEnvironment
} from "./logic.helpers";
import { getWordPatternDictionary } from "./word-patterns.helpers";
import { PhonologicalToken, PhonologicalTokenType, getPhonemeClassDictionary } from "./phonology.helpers";
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

export function getSoundChanges(language: ILanguage): string[] {
  return language.phonology.soundChanges.split('\n');
}

export function splitVariableToken(token: string) {
  const openingBracket = token.indexOf('{');
  const closingBracket = token.indexOf('}');
  if (openingBracket !== -1 && closingBracket !== -1) {
    return token.slice(openingBracket + 1, closingBracket).split(',').map(x => x.trim());
  } else {
    return [ token ];
  }
}

export function applySoundChanges(language: ILanguage, filledWordStr: string): string {
  const soundChanges = getSoundChanges(language);
  let environment = `#${filledWordStr}#`;
  soundChanges.forEach(changeRule => {
    let instruction = changeRule;
    let inEnvironmentOf = '';

    if (changeRule.includes('/')) {
      let tokens = changeRule.split('/').map(x => x.trim());
      instruction = tokens[0];
      inEnvironmentOf = tokens[1];
      // applies = environment.includes(tokens[1]);
    }
    let [target, result] = instruction.split('>').map(x => x.trim());

    let matchFor = `(${splitVariableToken(target).join('|')})`;
    const test = inEnvironmentOf
      ? new RegExp(inEnvironmentOf.replace('_', matchFor), 'g')
      : new RegExp(matchFor, 'g');
    const matches: RegExpMatchArray | null = environment.match(test);
    if (matches) {
      // console.log(environment, target, inEnvironmentOf, matchFor, environment.match(new RegExp(matchFor, 'g')), matches, '>', result);
      // console.log(matches.index);
      matches.forEach((match: string) => {
        const realTarget = match.match(matchFor)?.[0];
        if (!realTarget) { console.log('???'); return; }
        const index = environment.indexOf(realTarget, environment.indexOf(match));
        // console.log(environment, match, result, realTarget, index);
        environment = insertString(environment, result, index, realTarget.length - 1);
      });
    }
  });
  return environment.slice(1, environment.length - 1);
}

export function getSoundChange(insert: PhonologicalToken, env: StringEnvironment, language: ILanguage): PhonologicalToken | null {
  const soundChanges = getSoundChanges(language);
  env.environment = `#${env.environment}#`;
  const environment = markPositionInEnvironment(env);

  for (let i = 0; i < soundChanges.length; i++) {
    const changeRule = soundChanges[i];
    let instruction = changeRule;

    let applies = true;
    if (changeRule.includes('/')) {
      let tokens = changeRule.split('/').map(x => x.trim());
      instruction = tokens[0];
      applies = environment.includes(tokens[1]);
    }

    const [target, result] = instruction.split('>').map(x => x.trim());
    const targets = splitVariableToken(target);
    
    if (applies) {
      if (targets.includes(insert.token)) {
        insert.token = result;
        return insert;
      }
    }
  };
  return null;
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
