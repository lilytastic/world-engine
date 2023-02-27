

import React, { useEffect, useState } from 'react';
import { ILanguage } from '../models/sounds.model';

import { getLanguages, updateLanguage } from '../reducers/language.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Form from 'react-bootstrap/Form';

export function ForbiddenCombinations(props: {children?: any}) {

  const dispatch = useDispatch();
  const languages = useSelector(getLanguages);
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const [currentForbiddenCombinations, setForbiddenCombinations] = useState('');
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const language = languages.entities[params.id];
      if (language) {
        setLanguage(language);
        setForbiddenCombinations(language.phonology.forbiddenCombinations);  
      }
    }
  }, [languages, params.id]);

  const updateForbiddenCombinations = (forbiddenCombinations: string) => {
    dispatch(updateLanguage({...language, phonology: {...language?.phonology, forbiddenCombinations}}));
  }
  const updateBanSameVowels = (banSameVowels: boolean) => {
    dispatch(updateLanguage({...language, phonology: {...language?.phonology, banSameVowels}}));
  }
  const updateBanSameConsonants = (banSameConsonants: boolean) => {
    dispatch(updateLanguage({...language, phonology: {...language?.phonology, banSameConsonants}}));
  }
  
  if (!language) {
    return <></>;
  }

  return (<>
    <Form.Label htmlFor="forbiddenCombinations">Forbidden Combinations</Form.Label>
    <Form.Control
      as='input'
      id='forbiddenCombinations'
      value={currentForbiddenCombinations}
      onChange={ev => setForbiddenCombinations(ev.currentTarget.value)}
      onBlur={ev => updateForbiddenCombinations(ev.currentTarget.value)}
    />

    <div className="mt-3">
      <Form.Check
        label="Ban two of the same vowels in a row"
        name="group1"
        type='checkbox'
        checked={language.phonology.banSameVowels}
        onChange={ev => updateBanSameVowels(ev.currentTarget.checked)}
        id='inline-type-1'
      />
      <Form.Check
        label="Ban two of the same consonants in a row"
        name="group1"
        type='checkbox'
        checked={language.phonology.banSameConsonants}
        onChange={ev => updateBanSameConsonants(ev.currentTarget.checked)}
        id='inline-type-2'
      />
    </div>

  </>);
}
