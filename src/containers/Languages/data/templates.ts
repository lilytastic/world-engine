import { ProbabilityType } from "../helpers/logic.helpers";
import { ILanguage } from "../models/language.model";


export interface ILanguageTemplate {
  template: Partial<ILanguage>;
  label: string;
}


export const DEFAULT_LANGUAGE: ILanguage = {
  id: 1,
  name: "",
  type: 'language',
  dictionary: {},
  vocabulary: {
    generateWords: '',
    derivedWords: '',
    useDefaultRootWords: true,
    useDefaultDerivedWords: true
  },
  spelling: {
    spellingRules: ''
  },
  vowels: [],
  consonants: [],
  phonology: {
    syllableShape: 'CV(C)',
    phonemeClasses: 'S = CV CVL VL\nC = f d t r\nO =  l n C m g\nV = a e i o u\nL = b k C p r q g',
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

export const ENGLISH_TEMPLATE: Partial<ILanguage> = {
  phonology: {
    ...DEFAULT_LANGUAGE.phonology,
    phonemeClasses: `C = f g h\nV = a e\nS = CVC`
  }
};

export const TEMPLATES: ILanguageTemplate[] = [
  {
    template: ENGLISH_TEMPLATE,
    label: 'English'
  }
]
