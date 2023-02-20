import { IConsonant, Manner, Place } from "./sounds.model";

export const CONSONANTS: IConsonant[] = [

  // Plosives

  {
    place: Place.Bilabial,
    manner: Manner.Plosive,
    key: 'p'
  },
  {
    place: Place.Bilabial,
    manner: Manner.Plosive,
    key: 'b',
    voiced: true
  },
  {
    place: Place.LabioDental,
    manner: Manner.Plosive,
    key: 'p̪',
    advanced: true
  },
  {
    place: Place.LabioDental,
    manner: Manner.Plosive,
    key: 'b̪',
    advanced: true,
    voiced: true
  },
  {
    place: Place.LinguoLabial,
    manner: Manner.Plosive,
    key: 't̼',
    advanced: true
  },
  {
    place: Place.LinguoLabial,
    manner: Manner.Plosive,
    key: 'd̼',
    advanced: true,
    voiced: true
  },
  {
    place: Place.Alveolar,
    manner: Manner.Plosive,
    key: 't'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Plosive,
    key: 'd',
    voiced: true
  },
  {
    place: Place.Retroflex,
    manner: Manner.Plosive,
    key: 'ʈ',
    romanization: 't'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Plosive,
    key: 'ɖ',
    romanization: 'd',
    voiced: true
  },

  {
    place: Place.Palatal,
    manner: Manner.Plosive,
    key: 'c'
  },
  {
    place: Place.Palatal,
    manner: Manner.Plosive,
    key: 'ɟ',
    voiced: true
  },
  {
    place: Place.Velar,
    manner: Manner.Plosive,
    key: 'k'
  },
  {
    place: Place.Velar,
    manner: Manner.Plosive,
    key: 'g',
    voiced: true
  },
  {
    place: Place.Uvular,
    manner: Manner.Plosive,
    key: 'q',
    romanization: 'q',
  },
  {
    place: Place.Uvular,
    manner: Manner.Plosive,
    key: 'ɢ',
    romanization: 'gh',
    voiced: true
  },
  {
    place: Place.Glottal,
    manner: Manner.Plosive,
    key: 'ʔ',
    romanization: 'gh'
  },

  // Nasal

  {
    place: Place.Bilabial,
    manner: Manner.Nasal,
    key: 'm'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Nasal,
    key: 'ɱ',
    romanization: 'm'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Nasal,
    key: 'n',
    romanization: 'n'
  },
  {
    place: Place.Palatal,
    manner: Manner.Nasal,
    key: 'ɲ'
  },
  {
    place: Place.Uvular,
    manner: Manner.Nasal,
    key: 'ɴ',
    romanization: 'ng'
  },
  {
    place: Place.Velar,
    manner: Manner.Nasal,
    key: 'ŋ',
    romanization: 'ng'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Nasal,
    key: 'ɳ',
    romanization: 'ng'
  },


  // Fricatives

  {
    place: Place.PostAlveolar,
    manner: Manner.SibilantFricative,
    key: 'ʃ',
    romanization: 'sh'
  },
  {
    place: Place.PostAlveolar,
    manner: Manner.SibilantFricative,
    key: 'ʒ',
    romanization: 'j',
    voiced: true
  },
  {
    place: Place.Retroflex,
    manner: Manner.SibilantFricative,
    key: 'ʂ',
    romanization: 'sh'
  },
  {
    place: Place.Retroflex,
    manner: Manner.SibilantFricative,
    key: 'ʐ',
    romanization: 'j',
    voiced: true
  },
  {
    place: Place.Palatal,
    manner: Manner.NonSibilantFricative,
    key: 'ç',
    romanization: 'sh'
  },
  {
    place: Place.Palatal,
    manner: Manner.NonSibilantFricative,
    key: 'ʝ',
    romanization: 'y',
    voiced: true
  },
  {
    place: Place.Bilabial,
    manner: Manner.NonSibilantFricative,
    key: 'ɸ',
    romanization: 'th'
  },
  {
    place: Place.Bilabial,
    manner: Manner.NonSibilantFricative,
    key: 'β',
    romanization: 'th',
    voiced: true
  },
  {
    place: Place.LabioDental,
    manner: Manner.NonSibilantFricative,
    key: 'f'
  },
  {
    place: Place.LabioDental,
    manner: Manner.NonSibilantFricative,
    key: 'v',
    voiced: true
  },
  {
    place: Place.Dental,
    manner: Manner.NonSibilantFricative,
    key: 'θ',
    romanization: 'th'
  },
  {
    place: Place.Dental,
    manner: Manner.NonSibilantFricative,
    key: 'ð',
    romanization: 'th',
    voiced: true
  },
  {
    place: Place.Alveolar,
    manner: Manner.SibilantFricative,
    key: 's'
  },
  {
    place: Place.Alveolar,
    manner: Manner.SibilantFricative,
    key: 'z',
    voiced: true
  },
  {
    place: Place.Velar,
    manner: Manner.NonSibilantFricative,
    key: 'x',
    romanization: 'kh'
  },
  {
    place: Place.Velar,
    manner: Manner.NonSibilantFricative,
    key: 'ɣ',
    romanization: 'jh',
    voiced: true
  },
  {
    place: Place.Uvular,
    manner: Manner.NonSibilantFricative,
    key: 'χ',
    romanization: 'h'
  },
  {
    place: Place.Uvular,
    manner: Manner.NonSibilantFricative,
    key: 'ʁ',
    romanization: 'wr',
    voiced: true
  },
  {
    place: Place.Pharyngeal,
    manner: Manner.NonSibilantFricative,
    key: 'ħ',
    romanization: 'h'
  },
  {
    place: Place.Pharyngeal,
    manner: Manner.NonSibilantFricative,
    key: 'ʕ',
    romanization: 'hw',
    voiced: true
  },
  {
    place: Place.Glottal,
    manner: Manner.NonSibilantFricative,
    key: 'h',
    romanization: 'h'
  },
  {
    place: Place.Glottal,
    manner: Manner.NonSibilantFricative,
    key: 'ɦ',
    romanization: 'h',
    voiced: true
  },

  {
    place: Place.Alveolar,
    manner: Manner.Tap,
    key: 'ɾ',
    romanization: 'r'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Tap,
    key: 'ⱱ',
    romanization: 'vr'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Tap,
    key: 'ɽ',
    romanization: 'r'
  },

  {
    place: Place.Bilabial,
    manner: Manner.Trill,
    key: 'ʙ',
    romanization: 'b'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Trill,
    key: 'r',
    romanization: 'r'
  },
  {
    place: Place.Uvular,
    manner: Manner.Trill,
    key: 'ʀ',
    romanization: 'r'
  },

  {
    place: Place.Alveolar,
    manner: Manner.LateralFricative,
    key: 'ɬ',
    romanization: 'sh'
  },
  {
    place: Place.Alveolar,
    manner: Manner.LateralFricative,
    key: 'ɮ',
    romanization: 'j'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Approximant,
    key: 'ʋ',
    romanization: 'w'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Approximant,
    key: 'ɹ',
    romanization: 'wr'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Approximant,
    key: 'ɻ',
    romanization: 'rh'
  },
  {
    place: Place.Palatal,
    manner: Manner.Approximant,
    key: 'j',
    romanization: 'y'
  },
  {
    place: Place.Velar,
    manner: Manner.Approximant,
    key: 'ɰ',
    romanization: 'hr'
  },

  {
    place: Place.Alveolar,
    manner: Manner.LateralApproximant,
    key: 'l'
  },
  {
    place: Place.Retroflex,
    manner: Manner.LateralApproximant,
    key: 'ɭ',
    romanization: 'l'
  },
  {
    place: Place.Palatal,
    manner: Manner.LateralApproximant,
    key: 'ʎ',
    romanization: 'y'
  },
  {
    place: Place.Velar,
    manner: Manner.LateralApproximant,
    key: 'ʟ',
    romanization: 'wl'
  },


  /*
  {
    place: Place.Dental,
    manner: Manner.NonSibilantAffricate,
    key: 't̪θ',
    romanization: 'th',
    advanced: true
  },
  {
    place: Place.Dental,
    manner: Manner.NonSibilantAffricate,
    key: 'd̪ð',
    romanization: 'th',
    advanced: true
  },
  */
];
