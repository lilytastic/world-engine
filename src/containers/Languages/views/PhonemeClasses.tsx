

import React, { useEffect, useState } from 'react';
import { ILanguage, IPhonotactic } from '../models/sounds.model';

import { getLanguages, updateLanguage } from '../reducers/language.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Form from 'react-bootstrap/Form';

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

  return (
    <Form.Group className='my-3'>
      <Form.Label htmlFor="phonemeClasses">Phoneme Classes</Form.Label>
      <Form.Control
        as='textarea'
        id='phonemeClasses'
        value={currentPhonemeClasses}
        onChange={ev => setPhonemeClasses(ev.currentTarget.value)}
        onBlur={ev => updatePhonemeClasses(ev.currentTarget.value)}
      />
      <Form.Text>
        <ul className='list mt-2'>
          <li>Assign phonemes to classes (uppercase letters), which act as placeholders for Word Patterns</li>
          <li>The uppercase letters don't inherently mean anything, and any phoneme can be assigned to any class</li>
          <li>Classes contain sequences of phonemes (A = ion lar mel) and sequences of other classes (S = CV VC)</li>
          <li>If you need more than 26 classes, the following Greek letters can be used: ΓΔΘΛΞΠΣΦΨΩ</li>
        </ul>
      </Form.Text>
    </Form.Group>
  );
}
