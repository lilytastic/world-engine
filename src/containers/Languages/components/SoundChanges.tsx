

import React, { useEffect, useState } from 'react';
import { ILanguage } from '../models/language.model';

import { getLanguages, updateLanguage } from '../reducers/language.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Form from 'react-bootstrap/Form';

export function SoundChanges(props: {children?: any}) {

  const dispatch = useDispatch();
  const languages = useSelector(getLanguages);
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const [currentSoundChanges, setSoundChanges] = useState('');
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const language = languages.entities[params.id];
      if (language) {
        setLanguage(language);
        setSoundChanges(language.phonology.soundChanges);  
      }
    }
  }, [languages, params.id]);

  const updateSoundChanges = (soundChanges: string) => {
    dispatch(updateLanguage({...language, phonology: {...language?.phonology, soundChanges}}));
  }
  
  if (!language) {
    return <></>;
  }

  return (<>
    <Form.Label htmlFor="soundChanges">Sound Changes</Form.Label>
    <Form.Control
      as='textarea'
      id='soundChanges'
      placeholder='ʒ > d / _#'
      value={currentSoundChanges}
      onChange={ev => setSoundChanges(ev.currentTarget.value)}
      onBlur={ev => updateSoundChanges(ev.currentTarget.value)}
    />

  </>);
}
