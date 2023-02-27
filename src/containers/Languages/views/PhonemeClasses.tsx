

import React, { useEffect, useState } from 'react';
import { ILanguage } from '../models/sounds.model';

import { getLanguages, updateLanguage } from '../reducers/language.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Form from 'react-bootstrap/Form';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

export function PhonemeClasses(props: {children?: any}) {

  const dispatch = useDispatch();
  const languages = useSelector(getLanguages);
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const [currentPhonemeClasses, setPhonemeClasses] = useState(undefined as string | undefined);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const language = languages.entities[params.id];
      if (language) {
        setLanguage(language);
        setPhonemeClasses(language.phonology.phonemeClasses);  
      }
    }
  }, [languages, params.id]);

  const updatePhonemeClasses = (phonemeClasses: string) => {
    dispatch(updateLanguage({...language, phonology: {...language?.phonology, phonemeClasses}}));
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ul className='list'>
          <li>Assign phonemes to classes (uppercase letters), which act as placeholders for Word Patterns</li>
          <li>The uppercase letters don't inherently mean anything, and any phoneme can be assigned to any class</li>
          <li>Classes contain sequences of phonemes (A = ion lar mel) and sequences of other classes (S = CV VC)</li>
          <li>If you need more than 26 classes, the following Greek letters can be used: ΓΔΘΛΞΠΣΦΨΩ</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (<>
    <Form.Label htmlFor="phonemeClasses" className='d-flex justify-content-between align-items-center'>
      <div className='d-flex align-items-center'>
        Phoneme Classes
        <OverlayTrigger trigger="focus" placement='bottom' overlay={popover}>
          <Button variant='link' className='p-0 small text-secondary'>
            <i className='fas fa-circle-question small ms-2'></i>
          </Button>
        </OverlayTrigger>
      </div>
      <small className='text-muted'>
        {`most frequent <-> least frequent`}
      </small>
    </Form.Label>
    <Form.Control
      as='textarea'
      id='phonemeClasses'
      value={currentPhonemeClasses}
      onChange={ev => setPhonemeClasses(ev.currentTarget.value)}
      onBlur={ev => updatePhonemeClasses(ev.currentTarget.value)}
    />
  </>);
}
