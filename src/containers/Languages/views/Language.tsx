import React, { useEffect, useMemo, useState } from 'react';
import { generateWord, generateWordV2, getSampleWords } from '../helpers/generators.helpers';

import { ILanguage, IWord } from '../models/language.model';
import { useDispatch, useSelector } from 'react-redux';
import { getLanguages, updateLanguage } from '../reducers/language.reducer';
import { useParams } from 'react-router';
import { SampleWords } from '../components/SampleWords';
import { Breadcrumb, Button, Col, Form, Popover, Row, Tab, Tabs } from 'react-bootstrap';
import { LanguageOptions } from '../components/LanguageOptions';
import { NavLink } from 'react-router-dom';
import { PhoneticKeyboard } from '../components/PhoneticKeyboard';
import { AutoFormer } from '../../../components/AutoForm';
import { AutoForm, AutoFormField } from '../../Root/models/language.form';
import { universalWords } from '../../../assets/universaldictionary';
import { generateRules } from '../helpers/phonology.helpers';
import { ProbabilityType } from '../helpers/logic.helpers';
import { processWordFromDictionary } from '../components/WordDictionary';



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

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    // console.log(universalWords.split('\n').filter(x => !!x).map(processWordFromDictionary).filter(x => !!x));

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    if (!!language) {
      localStorage.setItem('language', JSON.stringify(language));
      setTitle(language.name);
      setSampleWords(getSampleWords(language));
    }
  }, [language]);

  const LanguageForm: AutoForm<ILanguage> = useMemo(() => {
    if (!language) { return []; }
    return [
      {
        type: AutoFormField.TabGroup,
        children: [
          {
            type: AutoFormField.Tab,
            label: 'Phonology',
            key: 'phonology', // In this case, all children will attempt to modify 'phonology.X' on the base object.
            children: [
              {
                type: AutoFormField.Group,
                children: [
                  {
                    type: AutoFormField.Control,
                    label: 'Word Patterns',
                    key: 'wordPatterns',
                    as: 'textarea',
                    popover: (<Popover id="popover-basic">
                      <Popover.Body>
                        <ul className='list'>
                          <li>Word patterns are made of classes or actual phonemes, eg: zVC means the word will always start with z, then a random choice of V and C.</li>
                          <li>Use brackets for optional patterns: CV(zV) means the zV pattern occurs 20% of the time. Manually change the probability by writing it after the brackets: CV(zV)50%.</li>
                          <li>Patterns for particular parts-of-speech can be added after the default patterns, eg: part-of-speech = ...</li>
                        </ul>
                      </Popover.Body>
                    </Popover>)
                  },
                ]
              },
              {
                type: AutoFormField.Group,
                children: [
                  {
                    type: AutoFormField.Control,
                    label: 'Phoneme Classes',
                    key: 'phonemeClasses',
                    as: 'textarea',
                    footerText: `most frequent <-> least frequent`,
                    popover: (<Popover id="popover-basic">
                      <Popover.Body>
                        <ul className='list'>
                          <li>Assign phonemes to classes (uppercase letters), which act as placeholders for Word Patterns</li>
                          <li>The uppercase letters don't inherently mean anything, and any phoneme can be assigned to any class</li>
                          <li>Classes contain sequences of phonemes (A = ion lar mel) and sequences of other classes (S = CV VC)</li>
                          <li>If you need more than 26 classes, the following Greek letters can be used: ΓΔΘΛΞΠΣΦΨΩ</li>
                        </ul>
                      </Popover.Body>
                    </Popover>)
                  },
                  {
                    type: AutoFormField.Radio,
                    label: 'Probability Dropoff',
                    key: 'dropoffRate',
                    popover: (
                      <Popover id="popover-basic">
                        <Popover.Body>
                          <ul className='list'>
                            <li>Phonemes are ranked by frequency from left (most frequent) to right (least frequent).</li>
                            <li><b>Fast</b> rate makes frequent phonemes even more frequent, <b>Medium</b> creates a more even spread, and <b>Equiprobable</b> creates a perfectly even spread.</li>
                            <li>When using Equiprobable, phonemes can be custom weighted by writing *multiplier. For example, p*10 makes p ten times more common than a phoneme without a multiplier. To make it less likely, multiply by a decimal: p*0.4.</li>
                          </ul>
                        </Popover.Body>
                      </Popover>
                    ),
                    options: [
                      {
                        label: 'Fast dropoff',
                        value: ProbabilityType.FastDropoff
                      },
                      {
                        label: 'Medium dropoff',
                        value: ProbabilityType.MediumDropoff
                      },
                      {
                        label: 'Equiprobable',
                        value: ProbabilityType.Equiprobable
                      }
                    ]
                  }
                ]
              },
              {
                type: AutoFormField.Group,
                children: [
                  {
                    type: AutoFormField.Control,
                    label: 'Forbidden Combinations',
                    key: 'forbiddenCombinations',
                    placeholder: '#ŋ dt',
                    as: 'textarea'
                  },
                  {
                    type: AutoFormField.CheckGroup,
                    label: 'Probability Dropoff',
                    options: [
                      {
                        label: 'Ban two of the same vowels in a row',
                        key: 'banSameVowels'
                      },
                      {
                        label: 'Ban two of the same consonants in a row',
                        key: 'banSameConsonants'
                      }
                    ]
                  }
                ]
              },
              {
                type: AutoFormField.Group,
                children: [
                  {
                    type: AutoFormField.Control,
                    label: 'Sound Changes',
                    key: 'soundChanges',
                    placeholder: 'ʒ > d / _#',
                    as: 'textarea'
                  },
                ]
              }
            ]
          },
          {
            type: AutoFormField.Tab,
            label: 'Vocabulary',
            id: 'vocabulary',
            children: [
              {
                type: AutoFormField.Group,
                children: [
                  {
                    type: AutoFormField.Control,
                    key: 'name',
                    label: 'Language Name'
                  }
                ]
              },
              {
                type: AutoFormField.Group,
                label: 'Dictionary',
                children: [
                  {
                    type: AutoFormField.WordDictionary,
                    key: 'dictionary',
                    templateOptions: {
                      generateWord: language ? () => { return generateWordV2(language) } : null
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }, [language]);
  

  if (!language) {
    return <div></div>;
  }

  const returnLayout = (children: JSX.Element) => (
    <Row>
      <Col xs={12} lg={8}>
        {children}
      </Col>
      <Col sm={6} md={4} className="position-relative overflow-hidden d-none d-lg-block">
        <div style={{transition: 'transform .5s ease-in-out .03s', transform: `translateY(${scrollPosition}px)`}}>
          <PhoneticKeyboard />
        </div>
      </Col>
    </Row>
  );

  return returnLayout(
    <div className='position-relative pb-5 mb-5'>
      <Breadcrumb className='mb-2 pb-1'>
        <Breadcrumb.Item linkAs={NavLink} linkProps={{to: '/languages'}}>Languages</Breadcrumb.Item>
        <Breadcrumb.Item active>{language.name || 'Untitled'}</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className='d-flex align-items-start position-relative lh-1 mb-4'>
        {language.type === 'Proto-language' ? 'Proto-' : ''}{language.name || 'Untitled'}{language.type === 'Family' ? ' Family' : ''}

        <LanguageOptions language={language} className='position-absolute top-0 end-0 d-flex'></LanguageOptions>
      </h1>

      <SampleWords></SampleWords>

      <AutoFormer data={language} form={LanguageForm} update={updateLanguage}></AutoFormer>
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
