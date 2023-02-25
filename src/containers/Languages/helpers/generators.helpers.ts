import { getAffectedSounds, getSound, getSoundById, getTokens } from "./phonology.helpers";
import { ILanguage, ISound, ISoundRules, ISyllable, IWord, SoundPositions, TypedSound, IPhonologicalRule, IPhonologicalToken, IPhonotactic } from "../models/sounds.model";
import { VOWELS } from "../data/vowels";
import { CONSONANTS } from "../data/consonants";

// TODO: Try to implement some of https://github.com/conlang-software-dev/Logopoeist
// TODO: Also this https://www.vulgarlang.com/sound-changes

function getRandomSound(sounds: ISound[]) {
  return sounds[Math.floor(Math.random() * sounds.length)];
}

export function transcribeWord(language: ILanguage, word: IWord) {
  return word.syllables.map(syllable => 
    syllable.sounds.map(phoneme => 
      [...VOWELS, ...CONSONANTS].find(sound => sound.phoneme === phoneme)
    ).map(x => 
      x?.romanization || x?.phoneme || ''
    )
  ).flat().join('');
}

export function getDefaultPositions(language: ILanguage, phoneme: string): SoundPositions[] {
  if (!!VOWELS.find(x => x.phoneme === phoneme)) {
    return [SoundPositions.Close, SoundPositions.Nucleus, SoundPositions.Start];
  }
  return [SoundPositions.Close, SoundPositions.Coda, SoundPositions.Onset, SoundPositions.Start];
}

export function generateDefaultRule(language: ILanguage, sound: ISound): ISoundRules {
  const defaultPositions = getDefaultPositions(language, sound.phoneme);
  return {positionsAllowed: defaultPositions, canCluster: false};
}


export const generateRules = (phonotactics: IPhonotactic[]): IPhonologicalRule[] => {
  return phonotactics.map(tactic => {
    let type = tactic.description;
    let script = tactic.script;
    const tokens = getTokens(script);
    return {type, script, tokens};
  });
}

export function checkForToken(tokens: IPhonologicalToken[], key: string) {
  return tokens.find(x => !!x.items.find(x => x.toLowerCase() === key));
}

export type IPACollection = TypedSound[];

export interface IPhonemeClass {
  className: string;
  tokens: string[];
}
export interface IWordPattern {
  patternName: string;
  pattern: string[];
}

export function getStringArray(str: string) {
  let arr: string[] = [];
  for (let i = 0; i < str.length; i++) {
    arr.push(str[i]);
  }
  return arr.filter(x => x !== ' ');
}

export function getPhonemeClasses(language: ILanguage): IPhonemeClass[] {
  return language.phonology.phonemeClasses.split('\n').map(token => {
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
  const dictionary: {[className: string]: string[]} = {};
  classes.forEach(c => {
    dictionary[c.className] = c.tokens;
  });

  return dictionary;
}

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
        patternName,
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
  const dictionary: {[className: string]: string[][]} = {};
  wordPatterns.forEach(c => {
    const index = c.patternName || 'word';
    const existing = dictionary[index];
    dictionary[index] = [...(existing || []), c.pattern];
  });

  return dictionary;
}

export function getSampleWords(language: ILanguage) {
  let arr: IWord[] = [];
  if (language.vowels.length === 0 || language.consonants.length === 0) { return arr; }

  const rules = generateRules(language.phonology.phonotactics);
  //console.log('rules', rules);
  
  const phonemeClasses = getPhonemeClassDictionary(language);
  const wordPatterns = getWordPatternDictionary(language);
  console.log('language', language);
  console.log('phonemeClasses', phonemeClasses);
  console.log('wordPatterns', wordPatterns);
  for (let i = 0; i < 30; i++) {
    arr.push(generateWord(language, rules, phonemeClasses));
  }
  return arr;
}

export function generateWordV2(language: ILanguage, phonemeClasses: {[id: string]: IPhonemeClass}, wordPatterns: {[id: string]: IWordPattern}) {
  return '';
}

export function generateWord(language: ILanguage, rules: IPhonologicalRule[], phonemeClasses: any) {
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
        const sound = getRandomSound(permitted);
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


export const printListExclusive = (list: any[]) => {
  if (list.length === 0) {
    return;
  }
  if (list.length === 1) {
    return list[0];
  }
  if (list.length === 2) {
    return list[0] + ' or ' + list[1];
  }
  return list.slice(0, list.length - 1).join(', ') + ', or ' + list[list.length - 1];
}
