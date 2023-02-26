import React, { useEffect, useState } from 'react';
import { getSampleWords } from '../helpers/generators.helpers';

import { ILanguage, IWord } from '../models/sounds.model';
import { useDispatch, useSelector } from 'react-redux';
import { getLanguages, updateLanguage } from '../reducers/language.reducer';
import { useParams } from 'react-router';
import { PhonemeClasses } from './PhonemeClasses';
import { WordPatterns } from './WordPatterns';
import { SampleWords } from './SampleWords';
import { Breadcrumb, Form, Tab, Tabs } from 'react-bootstrap';
import { ForbiddenCombinations } from './ForbiddenCombinations';
import { LanguageOptions } from './LanguageOptions';
import { NavLink } from 'react-router-dom';

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

  const [sampleWords, setSampleWords] = useState([] as IWord[]);

  const [title, setTitle] = useState('');


  useEffect(() => {
    if (!!language) {
      localStorage.setItem('language', JSON.stringify(language));
      setTitle(language.name);
      setSampleWords(getSampleWords(language));
    }
  }, [language]);


  if (!language) {
    return <div></div>;
  }

  return (
    <div className='position-relative pb-5 mb-5'>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={NavLink} linkProps={{to: '/languages'}}>Languages</Breadcrumb.Item>
        <Breadcrumb.Item active>{language.name || 'Untitled'}</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className='mb-4 d-flex align-items-center position-relative lh-1 mb-1'>
        {language.type === 'Proto-language' ? 'Proto-' : ''}{language.name || 'Untitled'}{language.type === 'Family' ? ' Family' : ''}

        <LanguageOptions language={language} className='position-absolute top-0 end-0'></LanguageOptions>
      </h1>
      {/*
      <h2 className='mb-4 mt-0 h6 text-muted'>
        {!language.ancestor ? 'No ancestors' : `Dialect of ${language.ancestor.name}`}
      </h2>

      <Card color='dark' className='my-4 mb-5 p-3'>
        <ul className='list m-0'>
          <li>Proto-language</li>
        </ul>
      </Card>
      */}
      
      <SampleWords></SampleWords>


      <Tabs
        defaultActiveKey="phonology"
        id="uncontrolled-tab-example"
        className="my-4"
      >
        <Tab eventKey="phonology" title="Phonology">
          <Form.Group className='form-group mb-4'>
            <PhonemeClasses></PhonemeClasses>
            <hr />
            <WordPatterns></WordPatterns>
          </Form.Group>
          <Form.Group className='form-group'>
            <ForbiddenCombinations></ForbiddenCombinations>
          </Form.Group>
        </Tab>
        <Tab eventKey="spelling" title="Spelling">
          
        </Tab>
        <Tab eventKey="vocabulary" title="Vocabulary">
          <Form.Group className='form-group'>
            <Form.Label htmlFor='languageName'>Language name</Form.Label>
            <Form.Control
              as='input'
              id='languageName'
              value={language.name}
              onChange={ev => dispatch(updateLanguage({...language, name: ev.currentTarget.value}))}
            />
          </Form.Group>
        </Tab>
        <Tab eventKey="grammar" title="Grammar">
          
        </Tab>
      </Tabs>

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
