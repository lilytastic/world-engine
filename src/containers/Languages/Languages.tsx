import { useState } from 'react';
import { CONSONANTS } from './consonants';
import './Languages.scss';
import { IConsonant, ISound, ISyllable, IVowel, IWord, IWordSound, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS } from './sounds.model';
import { VOWELS } from './vowels';



export function Languages(props: {children?: any}) {

  const [chosenVowels, setChosenVowels] = useState([] as IVowel[]);
  const [chosenConsonants, setChosenConsonants] = useState([] as IConsonant[]);
  const [morphology, setMorphology] = useState('CV(C)');
  const [stressSystem, setStressSystem] = useState('');
  const [phonotactics, setPhonotactics] = useState('-j = ja/je\nq + a = qha\n~(x + x)\n~(C + ŋ)\n~(ŋ-)');

  function getRandomVowel(vowels: IVowel[]) {
    return vowels[Math.floor(Math.random() * vowels.length)];
  }
  function getRandomConsonant(consonants: IConsonant[]) {
    return consonants[Math.floor(Math.random() * consonants.length)];
  }

  function generateWord(vowels: IVowel[], consonants: IConsonant[]) {
    let length = 1 + Math.floor(Math.random() * 3);
    const morphologyMapped = morphology.toUpperCase().replace(/\(C\)/g, 'c');
    let syllables: ISyllable[] = [];

    for (let ii = 0; ii < length; ii++) {
      let syllable: ISyllable = {sounds: []};
      for (let i = 0; i < morphologyMapped.length; i++) {
        const token = morphologyMapped[i];
        let consonant = getRandomConsonant(consonants);
        const vowel = getRandomVowel(vowels);
        switch (token) {
          case 'V':
            syllable.sounds.push(vowel);
            break;
          case 'C':
            syllable.sounds.push(consonant);
            break;
          case 'c':
            if (Math.random() * 100 < 50) {
              syllable.sounds.push(consonant);
            }
            break;
          default:
            break;
        }
      }
      syllables.push(syllable)
    }

    let word: IWord = {
      syllables
    };
    return word;
  }

  function transcribeWord(word: IWord) {
    return word.syllables.map(syllable => syllable.sounds.map(x => x?.romanization || x?.key || '').join('')).join('');
  }

  function getSampleWords(vowels: IVowel[], consonants: IConsonant[]) {
    let arr: IWord[] = [];
    if (consonants.length === 0) { return arr; }
    for (let i = 0; i < 10; i++) {
      arr.push(generateWord(vowels, consonants));
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
                            onClick={() => !chosenVowels.find(x => x.key === sound.key)
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
        <h2>Phonotactics</h2>
        <h3 className='mt-4'>Syllable Shape</h3>
        <input value={morphology} onChange={ev => setMorphology(ev.currentTarget.value)} />        
      </div>

      <div className="mt-5">
        <h3>Rules</h3>
        <textarea value={phonotactics} onChange={ev => setPhonotactics(ev.currentTarget.value)} />        
      </div>

      <div className="mt-5">
        <h3>Stress System</h3>
        <textarea value={stressSystem} onChange={ev => setStressSystem(ev.currentTarget.value)} />        
      </div>

      <div className="mt-4">
        Sample words: <i>{getSampleWords(chosenVowels, chosenConsonants).map(word => transcribeWord(word)).join(', ')}</i>
      </div>
    </div>
  );
}