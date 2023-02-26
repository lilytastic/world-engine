
export interface ISound {
  type: string;
  phoneme: string;
  romanization?: string;
  advanced?: boolean;
  voiced?: boolean;
}

export type TypedSound = IVowel | IConsonant;

export interface ITypedSound<T extends string> extends ISound {
  type: T;
}

export interface IVowel extends ITypedSound<'vowel'> {
  frontness: string;
  openness: string;
  rounded?: boolean;
  long?: boolean;
}
export interface IConsonant extends ITypedSound<'consonant'> {
  place: string;
  manner: string;
}

export interface IWord {
  syllables: ISyllable[];
}
export interface ISyllable {
  sounds: string[];
}

export interface ILanguage {
  id: number;
  name: string;
  vowels: IVowel[];
  consonants: IConsonant[];
  phonology: IPhonology;
  ancestor?: ILanguage;
  type: string;
}
export const DEFAULT_LANGUAGE: ILanguage = {
  id: 1,
  name: "",
  type: 'language',
  vowels: [],
  consonants: [],
  phonology: {
    syllableShape: 'CV(C)',
    phonemeClasses: 'C = b k p t d r s v w q g\nL = l m n\nV = a e i o u\nS = CV CVL VC',
    wordPatterns: 'S\nSS\nSSS\n\narticle = \nS\nV\n\npronoun = \nS\nSS\n\ndeterminer = \nS',
    forbiddenCombinations: '',
    stressSystem: '',
    phonotactics: []
  }
}

export interface IPhonology {
  syllableShape: string;
  stressSystem: string;
  wordPatterns: string;
  forbiddenCombinations: string;
  phonemeClasses: string;
  phonotactics: IPhonotactic[];
}

export interface IPhonotactic {
  id: number;
  type: string;
  description: string;
  script: string;
}

export interface IPhonologicalToken {
  type: string;
  items: string[];
}

export interface IPhonologicalRule {
  type: string;
  tokens: IPhonologicalToken[];
  script: string;
} 

export enum PhonologicalTokens {
  Addition = '+',
  Subtractive = '-',
  Transform = '>',
  Filter = '/',
  Self = '_',
  Deletion = 'Ø',
  Syllable = 'σ',
  Word = '#'
}

export enum PhonologicalTokenCollectionTypes {
  Terms = 'term collection',
  Conditional = 'conditional collection',
  Logical = 'logical collection',
  LogicalOptional = 'optional logical collection',
  Phonetic = 'phonetic collection',
}

export const BOUNDARY_MARKERS: [string, string, string][] = [
  [PhonologicalTokenCollectionTypes.Terms, '[', ']'],
  [PhonologicalTokenCollectionTypes.Conditional, '<', '>'],
  [PhonologicalTokenCollectionTypes.Logical, '{', '}'],
  [PhonologicalTokenCollectionTypes.LogicalOptional, '(', ')'],
  [PhonologicalTokenCollectionTypes.Phonetic, '/', '/']
];

export enum SoundPositions {
  Start = 'Start',
  Onset = 'Onset',
  Nucleus = 'Nucleus',
  Coda = 'Coda',
  Close = 'Close'
}
export interface ISoundRules {
  canCluster: boolean;
  positionsAllowed: SoundPositions[];
}

export enum Place {
  Bilabial = 'Bilabial',
  LabioDental = 'Labio-dental',
  LinguoLabial = 'Linguo-labial',
  Dental = 'Dental',
  Alveolar = 'Alveolar',
  PostAlveolar = 'Post­-alveolar',
  Retroflex = 'Retroflex',
  Palatal = 'Palatal',
  Velar = 'Velar',
  Uvular = 'Uvular',
  Pharyngeal = 'Pharyn­geal',
  Glottal = 'Glottal',
}
export enum Manner {
  Nasal = 'Nasal',
  Plosive = 'Plosive',
  SibilantAffricate = 'Sibilant affricate',
  NonSibilantAffricate = 'Non-sibilant affricate',
  SibilantFricative = 'Sibilant fricative',
  NonSibilantFricative = 'Non-sibilant fricative',
  Approximant = 'Approximant',
  Tap = 'Tap/Flap',
  Trill = 'Trill',
  LateralAffricate = 'Lateral affricate',
  LateralFricative = 'Lateral fricative',
  LateralApproximant = 'Lateral approximant',
  LateralTap = 'Lateral tap'
}

export const PLACES = [
  {key: Place.Bilabial, name: 'Bilabial'},
  {key: Place.LabioDental, name: 'Labio-dental'},
  {key: Place.LinguoLabial, name: 'Linguo-labial'},
  {key: Place.Dental, name: 'Dental'},
  {key: Place.Alveolar, name: 'Alveolar'},
  {key: Place.PostAlveolar, name: 'Post­-alveolar'},
  {key: Place.Retroflex, name: 'Retroflex'},
  {key: Place.Palatal, name: 'Palatal'},
  {key: Place.Velar, name: 'Velar'},
  {key: Place.Uvular, name: 'Uvular'},
  {key: Place.Pharyngeal, name: 'Pharyn­geal'},
  {key: Place.Glottal, name: 'Glottal'},
];
export const MANNERS = [
  {key: Manner.Nasal, name: 'Nasal'},
  {key: Manner.Plosive, name: 'Plosive'},
  {key: Manner.SibilantAffricate, name: 'Sibilant affricate'},
  {key: Manner.NonSibilantAffricate, name: 'Non-sibilant affricate'},
  {key: Manner.SibilantFricative, name: 'Sibilant fricative'},
  {key: Manner.NonSibilantFricative, name: 'Non-sibilant fricative'},
  {key: Manner.Approximant, name: 'Approximant'},
  {key: Manner.Tap, name: 'Tap/Flap'},
  {key: Manner.Trill, name: 'Trill'},
  {key: Manner.LateralAffricate, name: 'Lateral affricate'},
  {key: Manner.LateralFricative, name: 'Lateral fricative'},
  {key: Manner.LateralApproximant, name: 'Lateral approximant'},
  {key: Manner.LateralTap, name: 'Lateral tap'}
];

export enum VowelLon {
  Close = 'Close',
  NearClose = 'Near-close',
  CloseMid = 'Close-mid',
  Mid = 'Mid',
  OpenMid = 'Open-mid',
  NearOpen = 'Near-open',
  Open = 'Open',
}
export enum VowelLat {
  Front = 'Front',
  Central = 'Central',
  Back = 'Back',
}

export const VOWELCLOSENESS = [
  {key: VowelLon.Close, name: 'Close'},
  {key: VowelLon.NearClose, name: 'Near-close'},
  {key: VowelLon.CloseMid, name: 'Close-mid'},
  {key: VowelLon.Mid, name: 'Mid'},
  {key: VowelLon.OpenMid, name: 'Open-mid'},
  {key: VowelLon.NearOpen, name: 'Near-open'},
  {key: VowelLon.Open, name: 'Open'},
];
export const VOWELFRONTNESS = [
  {key: VowelLat.Front, name: 'Front'},
  {key: VowelLat.Central, name: 'Central'},
  {key: VowelLat.Back, name: 'Back'}
];

export type IPACollection = TypedSound[];
export type IPhonemeClassDictionary = {[className: string]: IPhonemeClass};

export interface IPhonemeClass {
  className: string;
  tokens: string[];
}
export interface IWordPattern {
  patternName: string;
  pattern: string[];
}