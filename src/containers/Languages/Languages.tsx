import { useState } from 'react';
import { CONSONANTS } from './consonants';
import './Languages.scss';
import { IConsonant, ISound, IVowel, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS } from './sounds.model';
import { VOWELS } from './vowels';



export function Languages(props: {children?: any}) {

  const [chosenVowels, setChosenVowels] = useState([] as IVowel[]);
  const [chosenConsonants, setChosenConsonants] = useState([] as IConsonant[]);
  const [morphology, setMorphology] = useState('CVC');  // (C) works too
  const [phonotactics, setPhonotactics] = useState('-j = ja/je\nq + a = qha\n~(x + x)\n~(C + ŋ)\n~(ŋ-)');

  function getRandomVowel(vowels: IVowel[]) {
    return vowels[Math.floor(Math.random() * vowels.length)];
  }
  function getRandomConsonant(consonants: IConsonant[]) {
    return consonants[Math.floor(Math.random() * consonants.length)];
  }

  function generateWord(vowels: IVowel[], consonants: IConsonant[]) {
    if (consonants.length === 0) { return ''; }
    let word = '';
    let length = 1 + Math.floor(Math.random() * 3);
    const morphologyMapped = morphology.toUpperCase().replace(/"(C)"/g, 'c');

    for (let ii = 0; ii < length; ii++) {
      for (let i = 0; i < morphologyMapped.length; i++) {
        const token = morphologyMapped[i];
        let consonant = getRandomConsonant(consonants);
        const vowel = getRandomVowel(vowels);
        switch (token) {
          case 'V':
            word += vowel ? (vowel.romanization || vowel.key) : '';
            break;
          case 'C':
            word += consonant ? (consonant.romanization || consonant.key) : '';
            break;
          case 'c':
            if (Math.random() < 0.5) {
              word += consonant ? (consonant.romanization || consonant.key) : '';
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
      arr.push(generateWord(chosenVowels, chosenConsonants));
    }
    return arr;
  }

  return (
    <div>
      <h2>Vowels</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {VOWELFRONTNESS.map(place => (<th key={place.key}>{place.name}</th>))}
          </tr>
        </thead>
        <tbody>
          {VOWELCLOSENESS.map((openness) => (
            <tr key={openness.key}>
              <td>{openness.name}</td>
              {VOWELFRONTNESS.map(frontness => (
                <td key={frontness.key}>
                  {VOWELS.filter(sound => !sound.advanced && sound.frontness === frontness.key && sound.openness === openness.key).map(sound => (
                    <button key={sound.key}
                            onClick={() => !chosenConsonants.find(x => x.key === sound.key)
                              ? setChosenVowels([...chosenVowels, sound])
                              : setChosenVowels([...chosenVowels.filter(x => x.key !== sound.key)])}
                            className={`btn btn-link ${!!chosenVowels.find(x => x.key === sound.key) ? 'text-primary' : 'text-secondary'}`}>
                      {sound.key}
                    </button>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-5">Pulmonic Consonants</h2>
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