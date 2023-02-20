import { useEffect, useState } from 'react';
import './Languages.scss';
import { SoundSelection } from './Sounds';
import { IConsonant, ISyllable, IVowel, IWord, ILanguage, DEFAULT_LANGUAGE, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS } from './sounds.model';


export function Languages(props: {children?: any}) {

  const [morphology, setMorphology] = useState('CV(C)');
  const [isSelectingSounds, setIsSelectingSounds] = useState(false);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [stressSystem, setStressSystem] = useState('');
  const [phonotactics, setPhonotactics] = useState('-j = ja/je\nq + a = qha\n~(x + x)\n~(C + ŋ)\n~(ŋ-)');

  useEffect(() => {

  }, [language]);

  function getRandomVowel(vowels: IVowel[]) {
    return vowels[Math.floor(Math.random() * vowels.length)];
  }
  function getRandomConsonant(consonants: IConsonant[]) {
    return consonants[Math.floor(Math.random() * consonants.length)];
  }

  function generateWord(language: ILanguage) {
    let length = 1 + Math.floor(Math.random() * 3);
    const morphologyMapped = morphology.toUpperCase().replace(/\(C\)/g, 'c');
    let syllables: ISyllable[] = [];

    for (let ii = 0; ii < length; ii++) {
      let syllable: ISyllable = {sounds: []};
      for (let i = 0; i < morphologyMapped.length; i++) {
        const token = morphologyMapped[i];
        let consonant = getRandomConsonant(language.consonants);
        const vowel = getRandomVowel(language.vowels);
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

  function getSampleWords(language: ILanguage) {
    let arr: IWord[] = [];
    if (language.vowels.length === 0 || language.consonants.length === 0) { return arr; }
    for (let i = 0; i < 10; i++) {
      arr.push(generateWord(language));
    }
    return arr;
  }

  function selectSounds(vowels: IVowel[], consonants: IConsonant[]) {
    setLanguage({...language, vowels, consonants});
  }

  const frontnessUsed = VOWELFRONTNESS.filter(x => language.vowels.find(y => y.frontness === x.key));
  const opennessUsed = VOWELCLOSENESS.filter(x => language.vowels.find(y => y.openness === x.key));

  const placesUsed = PLACES.filter(x => language.consonants.find(y => y.place === x.key));
  const mannersUsed = MANNERS.filter(x => language.consonants.find(y => y.manner === x.key));

  return (
    <div>
      <h2 className='mt-0'>Sounds <button className='btn btn-link' onClick={() => setIsSelectingSounds(true)}>Edit</button></h2>
      <SoundSelection show={isSelectingSounds} handleClose={(vowels, consonants) => {selectSounds(vowels, consonants); setIsSelectingSounds(false);}}></SoundSelection>
      <h3>Vowels</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            {frontnessUsed.map(place => (<th key={place.key}>{place.name}</th>))}
          </tr>
        </thead>
        <tbody>
          {opennessUsed.map((openness) => (
            <tr key={openness.key}>
              <td>{openness.name}</td>
              {frontnessUsed.map(frontness => (
                <td key={frontness.key}>
                  {language.vowels.filter(sound => sound.frontness === frontness.key && sound.openness === openness.key).map(sound => (
                    sound.key
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Pulmonic Consonants</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            {placesUsed.map(place => (<th key={place.key}>{place.name}</th>))}
          </tr>
        </thead>
        <tbody>
          {mannersUsed.map((manner) => (
            <tr key={manner.key}>
              <td>{manner.name}</td>
              {placesUsed.map(place => (
                <td key={place.key}>
                  {language.consonants.filter(sound => sound.manner === manner.key && sound.place === place.key).map(sound => (
                    sound.key
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        Current sounds: <i>{language.consonants.map(sound => sound.key).join(', ')}</i>
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
        Sample words: <i>{getSampleWords(language).map(word => transcribeWord(word)).join(', ')}</i>
      </div>
    </div>
  );
}