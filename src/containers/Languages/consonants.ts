import { IConsonant, Manner, Place } from "./sounds.model";

export const CONSONANTS: IConsonant[] = [

  // Plosives

  {
    place: Place.Bilabial,
    manner: Manner.Plosive,
    phoneme: 'p'
  },
  {
    place: Place.Bilabial,
    manner: Manner.Plosive,
    phoneme: 'b',
    voiced: true
  },
  {
    place: Place.LabioDental,
    manner: Manner.Plosive,
    phoneme: 'p̪',
    advanced: true
  },
  {
    place: Place.LabioDental,
    manner: Manner.Plosive,
    phoneme: 'b̪',
    advanced: true,
    voiced: true
  },
  {
    place: Place.LinguoLabial,
    manner: Manner.Plosive,
    phoneme: 't̼',
    advanced: true
  },
  {
    place: Place.LinguoLabial,
    manner: Manner.Plosive,
    phoneme: 'd̼',
    advanced: true,
    voiced: true
  },
  {
    place: Place.Alveolar,
    manner: Manner.Plosive,
    phoneme: 't'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Plosive,
    phoneme: 'd',
    voiced: true
  },
  {
    place: Place.Retroflex,
    manner: Manner.Plosive,
    phoneme: 'ʈ',
    romanization: 't'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Plosive,
    phoneme: 'ɖ',
    romanization: 'd',
    voiced: true
  },

  {
    place: Place.Palatal,
    manner: Manner.Plosive,
    phoneme: 'c'
  },
  {
    place: Place.Palatal,
    manner: Manner.Plosive,
    phoneme: 'ɟ',
    voiced: true
  },
  {
    place: Place.Velar,
    manner: Manner.Plosive,
    phoneme: 'k'
  },
  {
    place: Place.Velar,
    manner: Manner.Plosive,
    phoneme: 'g',
    voiced: true
  },
  {
    place: Place.Uvular,
    manner: Manner.Plosive,
    phoneme: 'q',
    romanization: 'q',
  },
  {
    place: Place.Uvular,
    manner: Manner.Plosive,
    phoneme: 'ɢ',
    romanization: 'gh',
    voiced: true
  },
  {
    place: Place.Glottal,
    manner: Manner.Plosive,
    phoneme: 'ʔ',
    romanization: 'gh'
  },

  // Nasal

  {
    place: Place.Bilabial,
    manner: Manner.Nasal,
    phoneme: 'm'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Nasal,
    phoneme: 'ɱ',
    romanization: 'm'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Nasal,
    phoneme: 'n',
    romanization: 'n'
  },
  {
    place: Place.Palatal,
    manner: Manner.Nasal,
    phoneme: 'ɲ'
  },
  {
    place: Place.Uvular,
    manner: Manner.Nasal,
    phoneme: 'ɴ',
    romanization: 'ng'
  },
  {
    place: Place.Velar,
    manner: Manner.Nasal,
    phoneme: 'ŋ',
    romanization: 'ng'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Nasal,
    phoneme: 'ɳ',
    romanization: 'ng'
  },


  // Fricatives

  {
    place: Place.PostAlveolar,
    manner: Manner.SibilantFricative,
    phoneme: 'ʃ',
    romanization: 'sh'
  },
  {
    place: Place.PostAlveolar,
    manner: Manner.SibilantFricative,
    phoneme: 'ʒ',
    romanization: 'j',
    voiced: true
  },
  {
    place: Place.Retroflex,
    manner: Manner.SibilantFricative,
    phoneme: 'ʂ',
    romanization: 'sh'
  },
  {
    place: Place.Retroflex,
    manner: Manner.SibilantFricative,
    phoneme: 'ʐ',
    romanization: 'j',
    voiced: true
  },
  {
    place: Place.Palatal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ç',
    romanization: 'sh'
  },
  {
    place: Place.Palatal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ʝ',
    romanization: 'y',
    voiced: true
  },
  {
    place: Place.Bilabial,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ɸ',
    romanization: 'th'
  },
  {
    place: Place.Bilabial,
    manner: Manner.NonSibilantFricative,
    phoneme: 'β',
    romanization: 'th',
    voiced: true
  },
  {
    place: Place.LabioDental,
    manner: Manner.NonSibilantFricative,
    phoneme: 'f'
  },
  {
    place: Place.LabioDental,
    manner: Manner.NonSibilantFricative,
    phoneme: 'v',
    voiced: true
  },
  {
    place: Place.Dental,
    manner: Manner.NonSibilantFricative,
    phoneme: 'θ',
    romanization: 'th'
  },
  {
    place: Place.Dental,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ð',
    romanization: 'th',
    voiced: true
  },
  {
    place: Place.Alveolar,
    manner: Manner.SibilantFricative,
    phoneme: 's'
  },
  {
    place: Place.Alveolar,
    manner: Manner.SibilantFricative,
    phoneme: 'z',
    voiced: true
  },
  {
    place: Place.Velar,
    manner: Manner.NonSibilantFricative,
    phoneme: 'x',
    romanization: 'kh'
  },
  {
    place: Place.Velar,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ɣ',
    romanization: 'jh',
    voiced: true
  },
  {
    place: Place.Uvular,
    manner: Manner.NonSibilantFricative,
    phoneme: 'χ',
    romanization: 'h'
  },
  {
    place: Place.Uvular,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ʁ',
    romanization: 'wr',
    voiced: true
  },
  {
    place: Place.Pharyngeal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ħ',
    romanization: 'h'
  },
  {
    place: Place.Pharyngeal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ʕ',
    romanization: 'hw',
    voiced: true
  },
  {
    place: Place.Glottal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'h',
    romanization: 'h'
  },
  {
    place: Place.Glottal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ɦ',
    romanization: 'h',
    voiced: true
  },

  {
    place: Place.Alveolar,
    manner: Manner.Tap,
    phoneme: 'ɾ',
    romanization: 'r'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Tap,
    phoneme: 'ⱱ',
    romanization: 'vr'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Tap,
    phoneme: 'ɽ',
    romanization: 'r'
  },

  {
    place: Place.Bilabial,
    manner: Manner.Trill,
    phoneme: 'ʙ',
    romanization: 'b'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Trill,
    phoneme: 'r',
    romanization: 'r'
  },
  {
    place: Place.Uvular,
    manner: Manner.Trill,
    phoneme: 'ʀ',
    romanization: 'r'
  },

  {
    place: Place.Alveolar,
    manner: Manner.LateralFricative,
    phoneme: 'ɬ',
    romanization: 'sh'
  },
  {
    place: Place.Alveolar,
    manner: Manner.LateralFricative,
    phoneme: 'ɮ',
    romanization: 'j'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Approximant,
    phoneme: 'ʋ',
    romanization: 'w'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Approximant,
    phoneme: 'ɹ',
    romanization: 'wr'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Approximant,
    phoneme: 'ɻ',
    romanization: 'rh'
  },
  {
    place: Place.Palatal,
    manner: Manner.Approximant,
    phoneme: 'j',
    romanization: 'y'
  },
  {
    place: Place.Velar,
    manner: Manner.Approximant,
    phoneme: 'ɰ',
    romanization: 'hr'
  },

  {
    place: Place.Alveolar,
    manner: Manner.LateralApproximant,
    phoneme: 'l'
  },
  {
    place: Place.Retroflex,
    manner: Manner.LateralApproximant,
    phoneme: 'ɭ',
    romanization: 'l'
  },
  {
    place: Place.Palatal,
    manner: Manner.LateralApproximant,
    phoneme: 'ʎ',
    romanization: 'y'
  },
  {
    place: Place.Velar,
    manner: Manner.LateralApproximant,
    phoneme: 'ʟ',
    romanization: 'wl'
  },


  /*
  {
    place: Place.Dental,
    manner: Manner.NonSibilantAffricate,
    phoneme: 't̪θ',
    romanization: 'th',
    advanced: true
  },
  {
    place: Place.Dental,
    manner: Manner.NonSibilantAffricate,
    phoneme: 'd̪ð',
    romanization: 'th',
    advanced: true
  },
  */
].map(x => ({...x, type: 'consonant'}))
