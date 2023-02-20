import { useEffect, useState } from 'react';
import './Languages.scss';
import { Phonotactics } from './Phonotactics';
import { SoundSelection } from './Sounds';
import { IConsonant, ISyllable, IVowel, IWord, ILanguage, DEFAULT_LANGUAGE, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS, IPhonotactics } from './sounds.model';


export function Languages(props: {children?: any}) {

  const [isSelectingSounds, setIsSelectingSounds] = useState(false);
  const [isEditingPhonotactics, setIsEditingPhonotactics] = useState(false);
  
  const storedLanguage = localStorage.getItem('_language');
  let startingLanguage: ILanguage = DEFAULT_LANGUAGE;
  try {
    if (storedLanguage) {
      startingLanguage = JSON.parse(storedLanguage);
    }
  } catch {
    startingLanguage = DEFAULT_LANGUAGE;
  }
  
  const [language, setLanguage] = useState(startingLanguage);

  useEffect(() => {
    localStorage.setItem('_language', JSON.stringify(language));
  }, [language]);

  function getRandomVowel(vowels: IVowel[]) {
    return vowels[Math.floor(Math.random() * vowels.length)];
  }
  function getRandomConsonant(consonants: IConsonant[]) {
    return consonants[Math.floor(Math.random() * consonants.length)];
  }

  function generateWord(language: ILanguage) {
    let length = 1 + Math.floor(Math.random() * 3);
    const morphologyMapped = language.phonotactics.syllableShape.toUpperCase().replace(/\(C\)/g, 'c');
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
  function selectPhonotactics(phonotactics: IPhonotactics) {
    setLanguage({...language, phonotactics});
  }

  const frontnessUsed = VOWELFRONTNESS.filter(x => language.vowels.find(y => y.frontness === x.key));
  const opennessUsed = VOWELCLOSENESS.filter(x => language.vowels.find(y => y.openness === x.key));

  const placesUsed = PLACES.filter(x => language.consonants.find(y => y.place === x.key));
  const mannersUsed = MANNERS.filter(x => language.consonants.find(y => y.manner === x.key));

  return (
    <div>
      <SoundSelection language={language} show={isSelectingSounds} handleClose={(vowels, consonants) => {selectSounds(vowels, consonants); setIsSelectingSounds(false);}}></SoundSelection>
      <Phonotactics language={language} show={isEditingPhonotactics} handleClose={(phonotactics) => {selectPhonotactics(phonotactics); setIsEditingPhonotactics(false);}}></Phonotactics>

      <h2 className='mt-0'>Vowels <button className='btn btn-link' onClick={() => setIsSelectingSounds(true)}>Edit</button></h2>
      {language.vowels.length === 0 && (<i>None yet!</i>)}
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

      <h2>Pulmonic Consonants <button className='btn btn-link' onClick={() => setIsSelectingSounds(true)}>Edit</button></h2>
      {language.consonants.length === 0 && (<i>None yet!</i>)}
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

      <h2>Phonotactics <button className='btn btn-link' onClick={() => setIsEditingPhonotactics(true)}>Edit</button></h2>
      Syllable shape: {language.phonotactics.syllableShape}

      <h2>Specimens</h2>
      <div>
        Sample words: <i>{getSampleWords(language).map(word => transcribeWord(word)).join(', ')}</i>
      </div>
    </div>
  );
}