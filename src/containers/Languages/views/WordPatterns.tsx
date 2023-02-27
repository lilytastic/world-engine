

import React, { useEffect, useState } from 'react';
import { ILanguage } from '../models/language.model';

import { getLanguages, updateLanguage } from '../reducers/language.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Form from 'react-bootstrap/Form';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

export function WordPatterns(props: {children?: any}) {

  const dispatch = useDispatch();
  const languages = useSelector(getLanguages);
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const [currentWordPatterns, setWordPatterns] = useState(undefined as string | undefined);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const language = languages.entities[params.id];
      if (language) {
        setLanguage(language);
        setWordPatterns(language.phonology.wordPatterns);  
      }
    }
  }, [languages, params.id]);

  const updateWordPatterns = (wordPatterns: string) => {
    dispatch(updateLanguage({...language, phonology: {...language?.phonology, wordPatterns}}));
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ul className='list'>
          <li>Word patterns are made of classes or actual phonemes, eg: zVC means the word will always start with z, then a random choice of V and C.</li>
          <li>Use brackets for optional patterns: CV(zV) means the zV pattern occurs 20% of the time. Manually change the probability by writing it after the brackets: CV(zV)50%.</li>
          <li>Patterns for particular parts-of-speech can be added after the default patterns, eg: part-of-speech = ...</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (<>
    <Form.Label htmlFor="wordPatterns">
      <div className='d-flex align-items-center'>
        Word Patterns
        <OverlayTrigger trigger="focus" placement='bottom' overlay={popover}>
          <Button variant='link' className='p-0 small text-secondary'>
            <i className='fas fa-circle-question small ms-2'></i>
          </Button>
        </OverlayTrigger>
      </div>
    </Form.Label>
    <Form.Control
      as='textarea'
      id='wordPatterns'
      value={currentWordPatterns}
      onChange={ev => setWordPatterns(ev.currentTarget.value)}
      onBlur={ev => updateWordPatterns(ev.currentTarget.value)}
    />
  </>);
}
