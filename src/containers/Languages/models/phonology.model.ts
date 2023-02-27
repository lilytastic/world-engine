

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
