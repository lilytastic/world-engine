import { useState } from 'react';
import { CONSONANTS } from './consonants';
import './Languages.scss';
import { IConsonant, ISound, IVowel, MANNERS, PLACES } from './sounds.model';



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