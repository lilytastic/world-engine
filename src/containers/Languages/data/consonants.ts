import { IConsonant, Manner, Place } from "../models/sounds.model";

export const CONSONANTS: IConsonant[] = [

  // Plosives

  {
    place: Place.Bilabial,
    manner: Manner.Plosive,
    phoneme: 'p',
    audio: 'Voiceless_bilabial_plosive.ogg.mp3'
  },
  {
    place: Place.Bilabial,
    manner: Manner.Plosive,
    phoneme: 'b',
    voiced: true,
    audio: 'Voiced_bilabial_plosive.ogg.mp3'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Plosive,
    phoneme: 'p̪',
    advanced: true,
    audio: null
  },
  {
    place: Place.LabioDental,
    manner: Manner.Plosive,
    phoneme: 'b̪',
    advanced: true,
    voiced: true,
    audio: null
  },
  {
    place: Place.LinguoLabial,
    manner: Manner.Plosive,
    phoneme: 't̼',
    advanced: true,
    audio: 'Voiceless_linguolabial_stop.ogg.mp3'
  },
  {
    place: Place.LinguoLabial,
    manner: Manner.Plosive,
    phoneme: 'd̼',
    advanced: true,
    voiced: true,
    audio: 'Voiced_linguolabial_stop.ogg.mp3'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Plosive,
    phoneme: 't',
    audio: 'Voiceless_alveolar_plosive.ogg.mp3'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Plosive,
    phoneme: 'd',
    voiced: true,
    audio: 'Voiced_alveolar_plosive.ogg.mp3'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Plosive,
    phoneme: 'ʈ',
    romanization: 't',
    audio: 'Voiceless_retroflex_stop.ogg.mp3'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Plosive,
    phoneme: 'ɖ',
    romanization: 'd',
    voiced: true,
    audio: 'Voiced_retroflex_stop.ogg.mp3'
  },

  {
    place: Place.Palatal,
    manner: Manner.Plosive,
    phoneme: 'c',
    audio: 'Voiceless_palatal_plosive.ogg.mp3'
  },
  {
    place: Place.Palatal,
    manner: Manner.Plosive,
    phoneme: 'ɟ',
    voiced: true,
    audio: 'Voiced_palatal_plosive.ogg.mp3'
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
    phoneme: 'ɲ',
    romanization: 'ñ'
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
    romanization: 'th',
    audio: 'Voiceless_dental_fricative.ogg.mp3'
  },
  {
    place: Place.Alveolar,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ð',
    romanization: 'th',
    voiced: true,
    audio: 'Voiced_alveolar_non-sibilant_fricative.ogg'
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
    romanization: 'kh',
    audio: 'Voiceless_velar_fricative.ogg.mp3'
  },
  {
    place: Place.Velar,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ɣ',
    romanization: 'jh',
    voiced: true,
    audio: 'Voiced_velar_fricative.ogg.mp3'
  },
  {
    place: Place.Uvular,
    manner: Manner.NonSibilantFricative,
    phoneme: 'χ',
    romanization: 'h',
    audio: 'Voiceless_uvular_fricative.ogg.mp3'
  },
  {
    place: Place.Uvular,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ʁ',
    romanization: 'wr',
    voiced: true,
    audio: 'Voiced_uvular_fricative.ogg.mp3'
  },
  {
    place: Place.Pharyngeal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ħ',
    romanization: 'h',
    audio: 'Voiceless_pharyngeal_fricative.ogg.mp3'
  },
  {
    place: Place.Pharyngeal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ʕ',
    romanization: 'hw',
    voiced: true,
    audio: 'Voiced_pharyngeal_fricative.ogg.mp3'
  },
  {
    place: Place.Glottal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'h',
    romanization: 'h',
    audio: 'Voiceless_glottal_fricative.ogg.mp3'
  },
  {
    place: Place.Glottal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ɦ',
    romanization: 'h',
    voiced: true,
    audio: 'Voiced_glottal_fricative.ogg.mp3'
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
