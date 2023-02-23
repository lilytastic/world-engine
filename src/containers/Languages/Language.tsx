import React, { useEffect, useState } from 'react';
import { getSampleWords, transcribeWord } from './generators.helpers';
import './Languages.scss';
import { Lexicon } from './Lexicon';
import { IPhonology } from './phonology.helpers';
import { Phonotactics } from './Phonotactics';
import { SoundSelection } from './Sounds';
import { IConsonant, IVowel, ILanguage, DEFAULT_LANGUAGE, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS, IWord } from './sounds.model';

import Dropdown from 'react-bootstrap/Dropdown';

// console.log('loaded', JSON.parse(localStorage.getItem('_language') || '{}'));

export function Language(props: {children?: any}) {

  const [isSelectingSounds, setIsSelectingSounds] = useState(false);
  const [isEditingPhonotactics, setIsEditingPhonotactics] = useState(false);
  const [isEditingLexicon, setIsEditingLexicon] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [sampleWords, setSampleWords] = useState([] as IWord[]);

  const storedLanguage = localStorage.getItem('language');
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
    setSampleWords(getSampleWords(language));
  }, []);

  useEffect(() => {
    if (sampleWords.length > 0) {
      console.log('Sample words:', sampleWords);
    }
  }, [sampleWords]);

  useEffect(() => {
    localStorage.setItem('language', JSON.stringify(language));
    setSampleWords(getSampleWords(language));
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
      <Lexicon language={language} show={isEditingLexicon} handleClose={(language) => {setLanguage(language); setIsEditingLexicon(false);}}></Lexicon>

      {isEditingTitle ? (
        <input autoFocus className='mb-3' value={language.name} onChange={ev => setLanguage({...language, name: ev.currentTarget.value})} onBlur={() => setIsEditingTitle(false)} />
      ) : (
        <>
          <h1 className='mt-0 mb-0 d-flex align-items-center'>
            {language.type === 'Proto-language' ? 'Proto-' : ''}{language.name}{language.type === 'Family' ? ' Family' : ''}
            <button className='btn btn-link ms-1' onClick={() => setIsEditingTitle(true)}>Edit</button>
          </h1>
          <div className='mb-0 mt-0 text-secondary'>
            {!language.ancestor ? 'No ancestors' : `Dialect of ${language.ancestor.name}`}
          </div>
        </>
      )}
      {/*
      <div className="form-check position-relative">
        <input className="form-check-input" checked={language.isProtoLanguage ? true : false} onChange={ev => setLanguage({...language, isProtoLanguage: ev.currentTarget.checked})} type="checkbox" id="flexCheckDefault" />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Is proto-language?
        </label>
      </div>
      */}
      <Dropdown className='mt-3' onSelect={ev => !!ev ? setLanguage({...language, type: ev}) : null}>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          {language.type}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="Language">Language</Dropdown.Item>
          <Dropdown.Item eventKey="Family">Family</Dropdown.Item>
          <Dropdown.Item eventKey="Proto-language">Proto-language</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>


      <h2>Lexicon <button className='btn btn-link' onClick={() => setIsEditingLexicon(true)}>Edit</button></h2>
      <div>
        <h4>Samples <button className='btn btn-link' onClick={() => setSampleWords(getSampleWords(language))}>Regenerate</button></h4>
        <div>
          <i>{sampleWords.map(word => transcribeWord(language, word)).join(', ')}</i>
        </div>
      </div>
      

      <h2>Phonology <button className='btn btn-link' onClick={() => setIsEditingPhonotactics(true)}>Edit</button></h2>

      <h4>Syllable shape</h4>
      {language.phonology.syllableShape}

      <h4>Rules</h4>
      <ul>
        {language.phonology.phonotactics.map(x => <div key={x.id} className='mb-3'>{x.description && (<label className='text-muted small'>{x.description || 'No description'}</label>)}<div>{x.script}</div></div>)}
      </ul>

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
                    sound.phoneme
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
                    sound.phoneme
                  )).join(' ')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}