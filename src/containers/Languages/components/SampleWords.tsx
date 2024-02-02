

import React, { useEffect, useState } from 'react';
import { ILanguage, IWord } from '../models/language.model';
import './SampleWords.scss';

import { useParams } from 'react-router';

import { generateWord } from '../helpers/generators.helpers';

export function SampleWords(props: {children?: any, amount?: number, language: ILanguage}) {

  const { language, amount } = props;

  const [currentSampleWords, setSampleWords] = useState([] as IWord[]);
  const params = useParams();

  const [lastLanguageUsed, setLastLanguageUsed] = useState(null as ILanguage | null);

  useEffect(() => {
    if (language) {
      /*
      const detectChangesTo = ['phonemeClasses', 'wordPatterns', 'forbiddenCombinations'];
      // @ts-ignore;
      if (!lastLanguageUsed || !!detectChangesTo.find((x) => language.phonology[x] !== lastLanguageUsed.phonology[x])) {
        setSampleWords(getSampleWords(language));
        setLastLanguageUsed(language);  
      }
      */
      setSampleWords(getSampleWords(language));
      setLastLanguageUsed(language);  
    }
  }, [language, lastLanguageUsed, params.id]);

  function getSampleWords(language: ILanguage) {
    let arr: IWord[] = [];
    for (let i = 0; i < (amount || 20); i++) {
      arr.push(generateWord(language));
    }
    return arr;
  }

  if (!language) {
    return <></>;
  }

  return (
    <div style={{minHeight: '9em'}}>
      <h3>
        Samples
        <button className='btn btn-link' onClick={() => setSampleWords(getSampleWords(language))}><i className='fas fa-rotate-right'></i></button>
      </h3>
      <div className='word-grid'>
        {currentSampleWords.map((x, i) => (<div className='word'>{x.transcription} <small className='text-secondary'>/{x.sounds.map(s => s.phoneme).join('')}/</small></div>))}
      </div>
    </div>
  );
}

