

export interface ISound {
  type: string;
  key: string;
  romanization?: string;
  advanced?: boolean;
  voiced?: boolean;
}
export interface ITypedSound<T extends string> extends ISound {
  type: T;
}

export interface IVowel extends ITypedSound<'vowel'> {
  frontness: string;
  openness: string;
  rounded?: boolean;
}
export interface IConsonant extends ITypedSound<'consonant'> {
  place: string;
  manner: string;
}

export interface IWordSound extends ISound {
  stress?: boolean;
}

export interface IWord {
  syllables: ISyllable[];
}
export interface ISyllable {
  sounds: IWordSound[];
}

export interface ILanguage {
  id: string;
  name: string;
  vowels: IVowel[];
  consonants: IConsonant[];
  phonology: IPhonology;
  ancestor?: ILanguage;
}
export const DEFAULT_LANGUAGE: ILanguage = {
  id: 'untitled',
  name: "Untitled",
  vowels: [],
  consonants: [],
  phonology: {
    syllableShape: 'CV(C)',
    stressSystem: '',
    phonotactics: []
  }
}

export interface IPhonology {
  syllableShape: string;
  stressSystem: string;
  phonotactics: IPhonotactic[];
}

export interface IPhonotactic {
  script: string;
}

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