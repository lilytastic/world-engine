import { useEffect, useState } from 'react';
import './Languages.scss';
import { Phonotactics } from './Phonotactics';
import { SoundSelection } from './Sounds';
import { IConsonant, ISyllable, IVowel, IWord, ILanguage, DEFAULT_LANGUAGE, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS, IPhonotactics, ISound, SoundPositions } from './sounds.model';


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
  function getRandomSound(sounds: ISound[]) {
    return sounds[Math.floor(Math.random() * sounds.length)];
  }

  function generateWord(language: ILanguage) {
    let length = 1 + Math.floor(Math.random() * 3);
    const morphologyMapped = language.phonotactics.syllableShape.toUpperCase().replace(/\(C\)/g, 'c');
    let syllables: ISyllable[] = [];

    for (let ii = 0; ii < length; ii++) {
      let syllable: ISyllable = {sounds: []};
      const onsetEnd = morphologyMapped.indexOf('V');
      const codaStart = morphologyMapped.lastIndexOf('V');
      for (let i = 0; i < morphologyMapped.length; i++) {
        const token = morphologyMapped[i];
        const isWordStart = ii === 0 && i === 0;
        const isWordClose = ii === length - 1 && i ===  morphologyMapped.length - 1;
        const isOnset = i < onsetEnd;
        const isCoda = i > codaStart;
        let sounds: ISound[] = [...language.vowels, ...language.consonants];

        sounds = sounds.filter(sound => {
          let rules = language.phonotactics.rules?.[sound.key];
          if (!rules) {
            rules = {
              positionsAllowed: [SoundPositions.Close, SoundPositions.Coda, SoundPositions.Nucleus, SoundPositions.Onset, SoundPositions.Start]
            };
          }
  
          if (isWordStart) {
            return rules?.positionsAllowed.includes(SoundPositions.Start);
          }
          if (isWordClose) {
            return rules?.positionsAllowed.includes(SoundPositions.Close);
          }

          switch (token) {
            case 'V':
              return rules?.positionsAllowed.includes(SoundPositions.Nucleus);
            case 'C':
              break;
            case 'c':
              if (Math.random() * 100 < 50) {
                return true;
              }
              return false;
            default:
              return true;
          }
          
        });

        if (sounds.length > 0) {
          const sound = getRandomSound(sounds);
          syllable.sounds.push(sound);
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

      <h2 className='mt-0'>Sounds <button className='btn btn-link' onClick={() => setIsSelectingSounds(true)}>Edit</button></h2>
      <h4>Vowels</h4>
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

      <h4>Pulmonic Consonants</h4>
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