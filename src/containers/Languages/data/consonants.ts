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
    audio: 'Voiceless_retroflex_stop.oga.mp3'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Plosive,
    phoneme: 'ɖ',
    romanization: 'd',
    voiced: true,
    audio: 'Voiced_retroflex_stop.oga.mp3'
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
    phoneme: 'k',
    audio: 'Voiceless_velar_plosive.ogg.mp3'
  },
  {
    place: Place.Velar,
    manner: Manner.Plosive,
    phoneme: 'g',
    voiced: true,
    audio: 'Voiced_velar_plosive.ogg.mp3'
  },
  {
    place: Place.Uvular,
    manner: Manner.Plosive,
    phoneme: 'q',
    romanization: 'q',
    audio: 'Voiceless_uvular_plosive.ogg.mp3'
  },
  {
    place: Place.Uvular,
    manner: Manner.Plosive,
    phoneme: 'ɢ',
    romanization: 'gh',
    voiced: true,
    audio: 'Voiced_uvular_stop.oga.mp3'
  },
  {
    place: Place.Glottal,
    manner: Manner.Plosive,
    phoneme: 'ʔ',
    romanization: 'gh',
    audio: 'Glottal_stop.ogg.mp3'
  },

  // Nasal

  {
    place: Place.Bilabial,
    manner: Manner.Nasal,
    phoneme: 'm',
    audio: 'Bilabial_nasal.ogg.mp3'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Nasal,
    phoneme: 'ɱ',
    romanization: 'm',
    audio: 'Labiodental_nasal.ogg.mp3'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Nasal,
    phoneme: 'n',
    romanization: 'n',
    audio: 'Alveolar_nasal.ogg.mp3'
  },
  {
    place: Place.Palatal,
    manner: Manner.Nasal,
    phoneme: 'ɲ',
    romanization: 'ñ',
    audio: 'Palatal_nasal.ogg.mp3'
  },
  {
    place: Place.Uvular,
    manner: Manner.Nasal,
    phoneme: 'ɴ',
    romanization: 'nm',
    audio: 'Uvular_nasal.ogg.mp3'
  },
  {
    place: Place.Velar,
    manner: Manner.Nasal,
    phoneme: 'ŋ',
    romanization: 'ng',
    audio: 'Velar_nasal.ogg.mp3'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Nasal,
    phoneme: 'ɳ',
    romanization: 'nh',
    audio: 'Retroflex_nasal.ogg.mp3'
  },


  // Fricatives

  {
    place: Place.PostAlveolar,
    manner: Manner.SibilantFricative,
    phoneme: 'ʃ',
    romanization: 'sh',
    audio: 'Voiceless_palato-alveolar_sibilant.ogg.mp3'
  },
  {
    place: Place.PostAlveolar,
    manner: Manner.SibilantFricative,
    phoneme: 'ʒ',
    romanization: 'j',
    voiced: true,
    audio: 'Voiced_palato-alveolar_sibilant.ogg.mp3'
  },
  {
    place: Place.Retroflex,
    manner: Manner.SibilantFricative,
    phoneme: 'ʂ',
    romanization: 'sh',
    audio: 'Voiceless_retroflex_sibilant.ogg.mp3'
  },
  {
    place: Place.Retroflex,
    manner: Manner.SibilantFricative,
    phoneme: 'ʐ',
    romanization: 'j',
    voiced: true,
    audio: 'Voiced_retroflex_sibilant.ogg.mp3'
  },
  {
    place: Place.Palatal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ç',
    romanization: 'sh',
    audio: 'Voiceless_palatal_fricative.ogg.mp3'
  },
  {
    place: Place.Palatal,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ʝ',
    romanization: 'y',
    voiced: true,
    audio: 'Voiced_palatal_fricative.ogg.mp3'
  },
  {
    place: Place.Bilabial,
    manner: Manner.NonSibilantFricative,
    phoneme: 'ɸ',
    romanization: 'th',
    audio: 'Voiceless_bilabial_fricative.ogg.mp3'
  },
  {
    place: Place.Bilabial,
    manner: Manner.NonSibilantFricative,
    phoneme: 'β',
    romanization: 'th',
    voiced: true,
    audio: 'Voiced_bilabial_fricative.ogg.mp3'
  },
  {
    place: Place.LabioDental,
    manner: Manner.NonSibilantFricative,
    phoneme: 'f',
    audio: 'Voiceless_labio-dental_fricative.ogg.mp3'
  },
  {
    place: Place.LabioDental,
    manner: Manner.NonSibilantFricative,
    phoneme: 'v',
    voiced: true,
    audio: 'Voiced_labio-dental_fricative.ogg.mp3'
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
    audio: 'Voiced_alveolar_non-sibilant_fricative.ogg.mp3'
  },
  {
    place: Place.Alveolar,
    manner: Manner.SibilantFricative,
    phoneme: 's',
    audio: 'Voiceless_alveolar_sibilant.ogg.mp3'
  },
  {
    place: Place.Alveolar,
    manner: Manner.SibilantFricative,
    phoneme: 'z',
    voiced: true,
    audio: 'Voiced_alveolar_sibilant.ogg.mp3'
  },
  {
    place: Place.Velar,
    manner: Manner.NonSibilantFricative,
    phoneme: 'x',
    romanization: 'ch',
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
    romanization: 'rh',
    audio: 'Alveolar_tap.ogg.mp3'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Tap,
    phoneme: 'ⱱ',
    romanization: 'vr',
    audio: 'Labiodental_flap.ogg.mp3'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Tap,
    phoneme: 'ɽ',
    romanization: 'r',
    audio: 'Retroflex_flap.ogg.mp3'
  },

  {
    place: Place.Bilabial,
    manner: Manner.Trill,
    phoneme: 'ʙ',
    romanization: 'b',
    audio: 'Bilabial_trill.ogg.mp3'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Trill,
    phoneme: 'r',
    romanization: 'r',
    audio: 'Alveolar_trill.ogg.mp3'
  },
  {
    place: Place.Uvular,
    manner: Manner.Trill,
    phoneme: 'ʀ',
    romanization: 'r',
    audio: 'Uvular_trill.ogg.mp3'
  },

  {
    place: Place.Alveolar,
    manner: Manner.LateralFricative,
    phoneme: 'ɬ',
    romanization: 'sh',
    audio: 'Voiceless_alveolar_lateral_fricative.ogg.mp3'
  },
  {
    place: Place.Alveolar,
    manner: Manner.LateralFricative,
    phoneme: 'ɮ',
    romanization: 'j',
    audio: 'Voiced_alveolar_lateral_fricative.ogg.mp3'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Approximant,
    phoneme: 'ʋ',
    romanization: 'w',
    audio: 'Labiodental_approximant.ogg.mp3'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Approximant,
    phoneme: 'ɹ',
    romanization: 'wr',
    audio: 'Alveolar_approximant.ogg.mp3'
  },
  {
    place: Place.Retroflex,
    manner: Manner.Approximant,
    phoneme: 'ɻ',
    romanization: 'rh',
    audio: 'Retroflex_Approximant2.oga.mp3'
  },
  {
    place: Place.Palatal,
    manner: Manner.Approximant,
    phoneme: 'j',
    romanization: 'y',
    audio: 'Palatal_approximant.ogg.mp3'
  },
  {
    place: Place.Velar,
    manner: Manner.Approximant,
    phoneme: 'ɰ',
    romanization: 'hr',
    audio: 'Voiced_velar_approximant.ogg.mp3'
  },

  {
    place: Place.Alveolar,
    manner: Manner.LateralApproximant,
    phoneme: 'l',
    audio: 'Alveolar_lateral_approximant.ogg.mp3'
  },
  {
    place: Place.Retroflex,
    manner: Manner.LateralApproximant,
    phoneme: 'ɭ',
    romanization: 'l',
    audio: 'Retroflex_lateral_approximant.ogg.mp3'
  },
  {
    place: Place.Palatal,
    manner: Manner.LateralApproximant,
    phoneme: 'ʎ',
    romanization: 'y',
    audio: 'Palatal_lateral_approximant.ogg.mp3'
  },
  {
    place: Place.Velar,
    manner: Manner.LateralApproximant,
    phoneme: 'ʟ',
    romanization: 'wl',
    audio: 'Velar_lateral_approximant.ogg.mp3'
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
