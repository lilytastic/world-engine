import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { generateWordV2 } from '../helpers/generators.helpers';

import { ILanguage } from '../models/language.model';
import { useDispatch, useSelector } from 'react-redux';
import { getLanguages, updateLanguage, updateScratch } from '../reducers/language.reducer';
import { useParams } from 'react-router';
import { SampleWords } from '../components/SampleWords';
import { Breadcrumb, Button, Col, Row } from 'react-bootstrap';
import { LanguageOptions } from '../components/LanguageOptions';
import { NavLink } from 'react-router-dom';
import { PhoneticKeyboard } from '../components/PhoneticKeyboard';
import { AutoFormer, mergeDeep } from '../../../components/AutoForm';
import { AutoForm } from '../../Root/models/language.form';
import { processWordFromDictionary } from '../components/WordDictionary';
import { universalWords } from '../../../assets/universaldictionary';
import { compileLanguageForm } from '../forms/language.form';



export function Language(props: {children?: any}) {

  const dispatch = useDispatch();
  const languages = useSelector(getLanguages);
  const [scratch, setScratch] = useState(null as ILanguage | null);
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const lang = languages.entities[params.id];
      setLanguage(lang);
    }
  }, [languages, params.id]);

  useEffect(() => {
    console.log(language);
    if (!language) { return; }
    setScratch({...language});
  }, [language]);

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
    }
  }, [language]);

  const generateDictionary = useCallback(() => {
    if (!scratch) { return; }
    const dictionary: {[word: string]: string} = {};
    if (scratch?.vocabulary.useDefaultRootWords) {
      universalWords.split('\n').forEach(word => {
        const duh = processWordFromDictionary(word);
        dictionary[duh.label] = generateWordV2(scratch);
      });
    }
    console.log(dictionary);
    setScratch(mergeDeep<ILanguage>(scratch, { dictionary: dictionary }));
  }, [scratch]);

  const LanguageForm: AutoForm<ILanguage> = useMemo(() => compileLanguageForm(language, generateDictionary), [language, generateDictionary]);

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

        <LanguageOptions scratch={scratch} language={language} className='position-absolute top-0 end-0 d-flex'></LanguageOptions>
      </h1>

      <SampleWords></SampleWords>

      <AutoFormer data={scratch} form={LanguageForm} update={setScratch}></AutoFormer>
    </div>
  );
}
