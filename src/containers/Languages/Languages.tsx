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
  {key: Place.LinguoLabial, name: 'Linguo-labial', advanced: true},
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
  {key: Manner.SibilantAffricate, name: 'Sibilant affricate', advanced: true},
  {key: Manner.NonSibilantAffricate, name: 'Non-sibilant affricate', advanced: true},
  {key: Manner.SibilantFricative, name: 'Sibilant fricative'},
  {key: Manner.NonSibilantFricative, name: 'Non-sibilant fricative', advanced: true},
  {key: Manner.Approximant, name: 'Approximant'},
  {key: Manner.Tap, name: 'Tap/Flap'},
  {key: Manner.Trill, name: 'Trill'},
  {key: Manner.LateralAffricate, name: 'Lateral affricate'},
  {key: Manner.LateralFricative, name: 'Lateral fricative'},
  {key: Manner.LateralApproximant, name: 'Lateral approximant'},
  {key: Manner.LateralTap, name: 'Lateral tap'}
];

export interface ISound {
  place: string;
  manner: string;
  key: string;
  romanization?: string;
}
const sounds: ISound[] = [
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
    place: Place.LabioDental,
    manner: Manner.Plosive,
    key: 'p̪'
  },
  {
    place: Place.LabioDental,
    manner: Manner.Plosive,
    key: 'b̪'
  },
  {
    place: Place.LinguoLabial,
    manner: Manner.Plosive,
    key: 't̼'
  },
  {
    place: Place.LinguoLabial,
    manner: Manner.Plosive,
    key: 'd̼'
  },
  {
    place: Place.Dental,
    manner: Manner.NonSibilantAffricate,
    key: 't̪θ',
    romanization: 'th'
  },
  {
    place: Place.Dental,
    manner: Manner.NonSibilantAffricate,
    key: 'd̪ð',
    romanization: 'th'
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
    place: Place.Alveolar,
    manner: Manner.SibilantFricative,
    key: 'z'
  }
];

export function Languages(props: {children?: any}) {

  const [chosenSounds, setChosenSounds] = useState([] as ISound[])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            {PLACES.filter(manner => !manner.advanced).map(place => (<th key={place.key}>{place.name}</th>))}
          </tr>
        </thead>
        <tbody>
          {MANNERS.filter(manner => !manner.advanced).map((manner) => (
            <tr key={manner.key}>
              <td>{manner.name}</td>
              {PLACES.map(place => (
                <td key={place.key}>
                  {sounds.filter(sound => sound.manner === manner.key && sound.place === place.key).map(sound => (
                    <button key={sound.key}
                            onClick={() => !chosenSounds.find(x => x.key === sound.key)
                              ? setChosenSounds([...chosenSounds, sound])
                              : setChosenSounds([...chosenSounds.filter(x => x.key !== sound.key)])}
                            className={`btn btn-link ${!!chosenSounds.find(x => x.key === sound.key) ? 'text-primary' : 'text-secondary'}`}>
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
        Current sounds: <i>{chosenSounds.map(sound => sound.key).join(', ')}</i>
      </div>
    </div>
  );
}