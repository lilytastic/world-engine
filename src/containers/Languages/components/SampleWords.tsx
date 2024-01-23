

import React, { useEffect, useState } from 'react';
import { ILanguage, IWord } from '../models/language.model';

import { useParams } from 'react-router';

import { getSampleWords } from '../helpers/generators.helpers';

export function SampleWords(props: {children?: any, language: ILanguage}) {

  const { language } = props;

  const [currentSampleWords, setSampleWords] = useState([] as IWord[]);
  const params = useParams();

  useEffect(() => {
    if (language) {
      setSampleWords(getSampleWords(language));
    }
  }, [language, params.id]);

  if (!language) {
    return <></>;
  }

  return (
    <div style={{minHeight: '9em'}}>
      <h3>
        Samples
        <button className='btn btn-link' onClick={() => setSampleWords(getSampleWords(language))}><i className='fas fa-rotate-right'></i></button>
      </h3>
      <div>
        <i>{currentSampleWords.map(x => x.transcription).join(', ')}</i>
      </div>
    </div>
  );
}

