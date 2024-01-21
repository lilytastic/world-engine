import { ProbabilityType } from "../helpers/logic.helpers";
import { IPhonotactic } from "./phonology.model";
import { IConsonant, IVowel } from "./sounds.model";

export interface ILanguage {
  id: number;
  name: string;
  dictionary: {[meaning: string]: string};
  vowels: IVowel[];
  consonants: IConsonant[];
  phonology: IPhonology;
  ancestor?: ILanguage;
  type: string;
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

export const DEFAULT_LANGUAGE: ILanguage = {
  id: 1,
  name: "",
  type: 'language',
  dictionary: {},
  vowels: [],
  consonants: [],
  phonology: {
    syllableShape: 'CV(C)',
    phonemeClasses: 'C = b k p t d r s v w q g\nL = l m n\nV = a e i o u\nS = CV CVL VC',
    wordPatterns: 'S\nSS\nSSS\n\narticle = \nS\nV\n\npronoun = \nS\nSS\n\ndeterminer = \nS',
    soundChanges: '',
    forbiddenCombinations: '',
    banSameVowels: true,
    banSameConsonants: false,
    dropoffRate: ProbabilityType.FastDropoff,
    stressSystem: '',
    phonotactics: []
  }
}

export interface IWord {
  syllables: ISyllable[];
}

export interface ISyllable {
  sounds: string[];
}
