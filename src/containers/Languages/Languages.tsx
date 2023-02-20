import { useState } from 'react';
import './Languages.scss';


enum Place {
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
enum Manner {
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

const PLACES = [
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
const MANNERS = [
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

enum VowelLon {
  Close = 'Close',
  NearClose = 'NearClose',
  CloseMid = 'Close-mid',
  Mid = 'Mid',
  OpenMid = 'Open-mid',
  NearOpen = 'NearOpen',
  Open = 'Open',
}
enum VowelLat {
  Front = 'Front',
  Central = 'Central',
  Back = 'Back',
}

export interface ISound {
  key: string;
  romanization?: string;
  advanced?: boolean;
}
export interface IVowel extends ISound {
  frontness: string;
  openness: string;
  rounded?: boolean;
}
export interface IConsonant extends ISound {
  place: string;
  manner: string;
}
const VOWELS: IVowel[] = [
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Front,
    key: 'a'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Front,
    key: 'ɶ',
    rounded: true
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Central,
    key: 'ä'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Front,
    key: 'i'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Front,
    key: 'y'
  },
]
const CONSONANTS: IConsonant[] = [
  {
    place: Place.Bilabial,
    manner: Manner.Plosive,
    key: 'p'
  },
  {
    place: Place.Bilabial,
    manner: Manner.Plosive,
    key: 'b'
  },
  {
    place: Place.Bilabial,
    manner: Manner.Nasal,
    key: 'm'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Nasal,
    key: 'n'
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
    advanced: true
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
    advanced: true
  },
  {
    place: Place.Alveolar,
    manner: Manner.Plosive,
    key: 't'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Plosive,
    key: 'd'
  },
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
    romanization: 'j'
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
    romanization: 'd'
  },
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
    romanization: 'th'
  },
  {
    place: Place.Alveolar,
    manner: Manner.SibilantFricative,
    key: 's'
  },
  {
    place: Place.Palatal,
    manner: Manner.Plosive,
    key: 'c'
  },
  {
    place: Place.Palatal,
    manner: Manner.Plosive,
    key: 'ɟ'
  },
  {
    place: Place.Alveolar,
    manner: Manner.SibilantFricative,
    key: 'z'
  },
  {
    place: Place.Velar,
    manner: Manner.NonSibilantFricative,
    key: 'x',
    romanization: 'qh'
  },
  {
    place: Place.Velar,
    manner: Manner.NonSibilantFricative,
    key: 'ɣ',
    romanization: 'jh'
  },
  {
    place: Place.Velar,
    manner: Manner.Plosive,
    key: 'k'
  },
  {
    place: Place.Velar,
    manner: Manner.Plosive,
    key: 'g'
  },
  {
    place: Place.Uvular,
    manner: Manner.Plosive,
    key: 'q'
  },
  {
    place: Place.Uvular,
    manner: Manner.Plosive,
    key: 'ɢ'
  },
  {
    place: Place.Glottal,
    manner: Manner.Plosive,
    key: 'ʔ'
  },
  {
    place: Place.Alveolar,
    manner: Manner.Tap,
    key: 'ɾ',
    romanization: 'r'
  },
  {
    place: Place.Velar,
    manner: Manner.Nasal,
    key: 'ŋ',
    romanization: 'ng'
  },
];

export function Languages(props: {children?: any}) {

  const [setVowels, setChosenVowels] = useState([] as ISound[]);
  const [chosenConsonants, setChosenConsonants] = useState([] as IConsonant[]);
  const [morphology, setMorphology] = useState('CVC');  // (C) works too
  const [phonotactics, setPhonotactics] = useState('-j = ja/je\nq + a = qha\n~(x + x)\n~(C + ŋ)\n~(ŋ-)');

  function getRandomConsonant(consonants: ISound[]) {
    return consonants[Math.floor(Math.random() * consonants.length)];
  }

  function generateWord(consonants: ISound[]) {
    if (consonants.length === 0) { return ''; }
    let word = '';
    let length = 1 + Math.floor(Math.random() * 3);
    const morphologyMapped = morphology.toUpperCase().replace(/"(C)"/g, 'c');

    for (let ii = 0; ii < length; ii++) {
      for (let i = 0; i < morphologyMapped.length; i++) {
        const token = morphologyMapped[i];
        const sound = getRandomConsonant(consonants);
        switch (token) {
          case 'V':
            word += 'a';
            break;
          case 'C':
            word += sound ? (sound.romanization || sound.key) : '';
            break;
          case 'c':
            if (Math.random() < 0.5) {
              word += sound ? (sound.romanization || sound.key) : '';
            }
            break;
          default:
            break;
        }
      }
    }

    return word;
  }

  function getSampleWords(consonants: ISound[]) {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(generateWord(chosenConsonants));
    }
    return arr;
  }

  return (
    <div>
      <h2>Vowels</h2>


      <h2>Pulmonic Consonants</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {PLACES.map(place => (<th key={place.key}>{place.name}</th>))}
          </tr>
        </thead>
        <tbody>
          {MANNERS.map((manner) => (
            <tr key={manner.key}>
              <td>{manner.name}</td>
              {PLACES.map(place => (
                <td key={place.key}>
                  {CONSONANTS.filter(sound => !sound.advanced && sound.manner === manner.key && sound.place === place.key).map(sound => (
                    <button key={sound.key}
                            onClick={() => !chosenConsonants.find(x => x.key === sound.key)
                              ? setChosenConsonants([...chosenConsonants, sound])
                              : setChosenConsonants([...chosenConsonants.filter(x => x.key !== sound.key)])}
                            className={`btn btn-link ${!!chosenConsonants.find(x => x.key === sound.key) ? 'text-primary' : 'text-secondary'}`}>
                      {sound.key}
                    </button>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        Current sounds: <i>{chosenConsonants.map(sound => sound.key).join(', ')}</i>
      </div>

      <div className="mt-5">
        <h2>Word Morphology</h2>
        <input value={morphology} onChange={ev => setMorphology(ev.currentTarget.value)} />        
      </div>

      <div className="mt-5">
        <h2>Phonotactics</h2>
        <textarea value={phonotactics} onChange={ev => setPhonotactics(ev.currentTarget.value)} />        
      </div>

      <div className="mt-4">
        Sample words: <i>{getSampleWords(chosenConsonants).join(', ')}</i>
      </div>
    </div>
  );
}