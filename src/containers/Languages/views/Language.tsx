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
import { Breadcrumb, Button, Card, Dropdown, Form, FormGroup, FormLabel, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { VOWELS } from '../data/vowels';
import { CONSONANTS } from '../data/consonants';
import { ForbiddenCombinations } from './ForbiddenCombinations';

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
    <div className='position-relative'>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={NavLink} linkProps={{to: '/languages'}}>Languages</Breadcrumb.Item>
        <Breadcrumb.Item active>{language.name || 'Untitled'}</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='mb-1 d-flex align-items-center lh-1 mb-1'>
        {language.type === 'Proto-language' ? 'Proto-' : ''}{language.name || 'Untitled'}{language.type === 'Family' ? ' Family' : ''}
      </h1>
      <h2 className='mb-4 mt-0 h6 text-muted'>
        {!language.ancestor ? 'No ancestors' : `Dialect of ${language.ancestor.name}`}
      </h2>

      <Dropdown className='position-absolute top-0 end-0'>
        <Dropdown.Toggle size="sm" variant="dark" id="dropdown-basic">
          Options&nbsp;
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Button}
                         onClick={ev => {}}
                         className='btn btn-link text-danger'>
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
      <SampleWords></SampleWords>


      <Tabs
        defaultActiveKey="phonology"
        id="uncontrolled-tab-example"
        className="my-4"
      >
        <Tab eventKey="phonology" title="Phonology">
          <Form.Group className='form-group border mb-4'>
            <PhonemeClasses></PhonemeClasses>
            <hr />
            <WordPatterns></WordPatterns>
          </Form.Group>
          <Form.Group className='form-group border'>
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
