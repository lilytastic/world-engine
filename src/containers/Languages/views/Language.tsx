import React, { useEffect, useState } from 'react';
import { getSampleWords } from '../helpers/generators.helpers';

import { Lexicon } from './Lexicon';
import { Phonotactics } from './Phonotactics';
import { SoundSelection } from './SoundSelection';
import { IConsonant, IVowel, ILanguage, IWord, IPhonology } from '../models/sounds.model';
import { useDispatch, useSelector } from 'react-redux';
import { getLanguages, updateLanguage } from '../reducers/language.reducer';
import { useParams } from 'react-router';
import { PhonemeClasses } from './PhonemeClasses';
import { WordPatterns } from './WordPatterns';
import { SampleWords } from './SampleWords';

export function Language(props: {children?: any}) {

  const dispatch = useDispatch();
  const languages = useSelector(getLanguages);
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      setLanguage(languages.entities[params.id]);
    }
  }, [languages, params.id]);

  const [isSelectingSounds, setIsSelectingSounds] = useState(false);
  const [isEditingPhonotactics, setIsEditingPhonotactics] = useState(false);
  const [isEditingLexicon, setIsEditingLexicon] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [sampleWords, setSampleWords] = useState([] as IWord[]);

  const [title, setTitle] = useState('');


  useEffect(() => {
    if (!!language) {
      localStorage.setItem('language', JSON.stringify(language));
      setTitle(language.name);
      setSampleWords(getSampleWords(language));
    }
  }, [language]);


  function selectSounds(vowels: IVowel[], consonants: IConsonant[]) {
    dispatch(updateLanguage({...language, vowels, consonants}));
  }
  function selectPhonotactics(phonotactics: IPhonology) {
    dispatch(updateLanguage({...language, phonology: phonotactics}));
  }

  if (!language) {
    return <div></div>;
  }


  return (
    <div>
      <Phonotactics
        language={language}
        show={isEditingPhonotactics}
        handleClose={(phonotactics) => {
          selectPhonotactics(phonotactics);
          setIsEditingPhonotactics(false);
        }}
      ></Phonotactics>
      <Lexicon
        language={language}
        show={isEditingLexicon}
        handleClose={(language) => {
          dispatch(updateLanguage(language));
          setIsEditingLexicon(false);
        }}
      ></Lexicon>

      {isEditingTitle ? (
        <input
          autoFocus
          className='mb-3'
          value={title}
          onChange={ev => setTitle(ev.currentTarget.value)}
          onBlur={ev => {
            dispatch(updateLanguage({...language, name: title}));
            setIsEditingTitle(false);
          }} />
      ) : (
        <>
          <h1 className='mb-0 d-flex align-items-center'>
            {language.type === 'Proto-language' ? 'Proto-' : ''}{language.name}{language.type === 'Family' ? ' Family' : ''}
            <button className='btn btn-link ms-1'
                    onClick={() => setIsEditingTitle(true)}>
                Edit
            </button>
          </h1>
          <div className='mb-0 mt-0 text-secondary'>
            {!language.ancestor ? 'No ancestors' : `Dialect of ${language.ancestor.name}`}
          </div>
        </>
      )}
      
      <SampleWords></SampleWords>
      <PhonemeClasses></PhonemeClasses>
      <WordPatterns></WordPatterns>

    </div>
  );
}

/*

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
        {language.phonology.phonotactics.map((x, i) => (
          <div key={x.id} className='mb-3'>
            <label className='small'>{i+1}) {x.description || 'No description'}</label>
            <div><code>{x.script}</code></div>
          </div>
        ))}
      </ul>

*/
