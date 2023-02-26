

import React, { useEffect, useState } from 'react';
import { ILanguage } from '../models/sounds.model';

import { getLanguages } from '../reducers/language.reducer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { getSampleWordsV2 } from '../helpers/generators.helpers';

export function SampleWords(props: {children?: any}) {

  const languages = useSelector(getLanguages);
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const [currentSampleWords, setSampleWords] = useState([] as string[]);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const language = languages.entities[params.id];
      if (language) {
        setLanguage(language);
        setSampleWords(getSampleWordsV2(language));
      }
    }
  }, [languages, params.id]);

  if (!language) {
    return <></>;
  }

  return (
    <div style={{minHeight: '9em'}}>
      <h3>
        Samples
        <button className='btn btn-link link-secondary' onClick={() => setSampleWords(getSampleWordsV2(language))}><i className='fas fa-rotate-right'></i></button>
      </h3>
      <div>
        <i>{currentSampleWords.join(', ')}</i>
      </div>
    </div>
  );
}

