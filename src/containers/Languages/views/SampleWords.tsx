

import React, { useEffect, useState } from 'react';
import { ILanguage, IWord } from '../models/sounds.model';

import { getLanguages } from '../reducers/language.reducer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { getSampleWords, transcribeWord } from '../helpers/generators.helpers';

export function SampleWords(props: {children?: any}) {

  const languages = useSelector(getLanguages);
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const [currentSampleWords, setSampleWords] = useState([] as IWord[]);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const language = languages.entities[params.id];
      if (language) {
        setLanguage(language);
      }
    }
  }, [languages, params.id]);

  if (!language) {
    return <></>;
  }

  return (
    <div>
      <h4>Samples <button className='btn btn-link' onClick={() => setSampleWords(getSampleWords(language))}>Regenerate</button></h4>
      <div>
        <i>{currentSampleWords.map(word => transcribeWord(language, word)).join(', ')}</i>
      </div>
    </div>
  );
}

