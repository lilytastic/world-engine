import { ProbabilityType } from "../helpers/logic.helpers";
import { IPhonotactic } from "./phonology.model";
import { IConsonant, IVowel, TypedSound } from "./sounds.model";

export interface ILanguage {
  id: number;
  name: string;
  dictionary: {[word: string]: string};
  vowels: IVowel[];
  spelling: {spellingRules: string};
  consonants: IConsonant[];
  phonology: IPhonology;
  ancestor?: ILanguage;
  vocabulary: IVocabulary;
  type: string;
}

export interface IVocabulary {
  generateWords: string;
  derivedWords: string;
  useDefaultRootWords: boolean;
  useDefaultDerivedWords: boolean;
}

export interface IPhonology {
  syllableShape: string;
  stressSystem: string;
  wordPatterns: string;
  soundChanges: string;
  forbiddenCombinations: string;
  banSameVowels: boolean;
  banSameConsonants: boolean;
  phonemeClasses: string;
  phonotactics: IPhonotactic[];
  dropoffRate: ProbabilityType;
}

/*
export interface IWord {
  syllables: ISyllable[];
}
*/
export interface IWord {
  transcription: string;
  sounds: TypedSound[];
}

export interface ISyllable {
  sounds: string[];
}
