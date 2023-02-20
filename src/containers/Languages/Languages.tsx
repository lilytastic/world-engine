import { useEffect, useState } from 'react';
import { generateWord, getSampleWords, printAllRules, transcribeWord } from './generators.helpers';
import './Languages.scss';
import { Phonotactics } from './Phonotactics';
import { SoundSelection } from './Sounds';
import { IConsonant, ISyllable, IVowel, IWord, ILanguage, DEFAULT_LANGUAGE, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS, IPhonology, ISound, SoundPositions } from './sounds.model';

// console.log('loaded', JSON.parse(localStorage.getItem('_language') || '{}'));

export function Languages(props: {children?: any}) {

  const [isSelectingSounds, setIsSelectingSounds] = useState(false);
  const [isEditingPhonotactics, setIsEditingPhonotactics] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const storedLanguage = localStorage.getItem('_language');
  let startingLanguage: ILanguage = DEFAULT_LANGUAGE;
  try {
    if (storedLanguage) {
      startingLanguage = {...DEFAULT_LANGUAGE, ...JSON.parse(storedLanguage)};
    }
  } catch {
    startingLanguage = DEFAULT_LANGUAGE;
  }

  const [language, setLanguage] = useState(startingLanguage);


  useEffect(() => {
    localStorage.setItem('_language', JSON.stringify(language));
  }, [language]);


  function selectSounds(vowels: IVowel[], consonants: IConsonant[]) {
    setLanguage({...language, vowels, consonants});
  }
  function selectPhonotactics(phonotactics: IPhonology) {
    setLanguage({...language, phonology: phonotactics});
  }
  

  const frontnessUsed = VOWELFRONTNESS.filter(x => language.vowels.find(y => y.frontness === x.key));
  const opennessUsed = VOWELCLOSENESS.filter(x => language.vowels.find(y => y.openness === x.key));

  const placesUsed = PLACES.filter(x => language.consonants.find(y => y.place === x.key));
  const mannersUsed = MANNERS.filter(x => language.consonants.find(y => y.manner === x.key));

  return (
    <div>
      <SoundSelection language={language} show={isSelectingSounds} handleClose={(vowels, consonants) => {selectSounds(vowels, consonants); setIsSelectingSounds(false);}}></SoundSelection>
      <Phonotactics language={language} show={isEditingPhonotactics} handleClose={(phonotactics) => {selectPhonotactics(phonotactics); setIsEditingPhonotactics(false);}}></Phonotactics>

      {isEditingTitle ? (
        <input autoFocus className='mb-3' value={language.name} onChange={ev => setLanguage({...language, name: ev.currentTarget.value})} onBlur={() => setIsEditingTitle(false)} />
      ) : (
        <>
          <h1 className='mt-0 mb-0'>{language.name} <button className='btn btn-link' onClick={() => setIsEditingTitle(true)}>Edit</button></h1>
          <div className='mb-3 mt-0 text-secondary'>
            {!language.ancestor ? 'Proto-language' : `Dialect of ${language.ancestor.name}`}
          </div>
        </>
      )}
      

      <h2>Lexicon <button className='btn btn-link' onClick={() => setIsEditingPhonotactics(true)}>Edit</button></h2>
      <div>
        Sample words: <i>{getSampleWords(language).map(word => transcribeWord(word)).join(', ')}</i>
      </div>


      <h2>Sounds <button className='btn btn-link' onClick={() => setIsSelectingSounds(true)}>Edit</button></h2>
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
                  )).join(' ')}
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
                  )).join(' ')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Phonology <button className='btn btn-link' onClick={() => setIsEditingPhonotactics(true)}>Edit</button></h2>

      <h3>Syllable shape</h3>
      {language.phonology.syllableShape}

      <h3>Phonotactics</h3>
      <ul>
        {printAllRules(language).map(x => (
          <li key={x} dangerouslySetInnerHTML={{__html: x}}></li>
        ))}
      </ul>
    </div>
  );
}