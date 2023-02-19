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

const sounds: {place: Place, manner: Manner, key: string}[] = [
  {
    place: Place.Bilabial,
    manner: Manner.Plosive,
    key: 'p'
  }
];

export function Languages(props: {children?: any}) {

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            {Object.keys(Place).map(place => (<th key={place}>{place}</th>))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(Manner).map(manner => (
            <tr key={manner}>
              <td>{manner}</td>
              {Object.keys(Place).map(place => (
                <td key={place}>
                  {sounds.filter(sound => sound.manner === manner && sound.place === place).map(sound => (
                    <button key={sound.key} className="btn btn-link">{sound.key}</button>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}