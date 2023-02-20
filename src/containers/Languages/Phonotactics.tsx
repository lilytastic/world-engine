

import React, { useEffect, useState } from 'react';
import { CONSONANTS } from './consonants';
import './Languages.scss';
import { IConsonant, ILanguage, IPhonotactics, IVowel, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS } from './sounds.model';
import { VOWELS } from './vowels';


import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export function Phonotactics(props: {children?: any, language: ILanguage, show: boolean, handleClose?: (arg0: IPhonotactics) => void}) {

  const [stressSystem, setStressSystem] = useState(props.language.phonotactics.stressSystem);
  const [rules, setRules] = useState(props.language.phonotactics.rules.join('\n'));
  const [morphology, setMorphology] = useState(props.language.phonotactics.syllableShape);
  const {show} = props;

  const compilePhonotactics = (): IPhonotactics => {
    return {
      syllableShape: morphology,
      rules: rules.split('\n'),
      stressSystem
    };
  }

  return (
    <Modal show={show} fullscreen={true} onHide={() => props.handleClose?.(compilePhonotactics())}>
      <Modal.Header>
        <Modal.Title>Sound Selection</Modal.Title>
        <Button onClick={() => props.handleClose?.(compilePhonotactics())}>Done</Button>
      </Modal.Header>

      <Modal.Body>
        <div className='pt-3 pb-5'>
          <h2>Phonotactics</h2>
          <h3 className='mt-4'>Syllable Shape</h3>
          <input value={morphology} onChange={ev => setMorphology(ev.currentTarget.value)} />
        </div>

        <div className="mt-5">
          <h3>Rules</h3>
          <textarea value={rules} onChange={ev => setRules(ev.currentTarget.value)} />
        </div>

        <div className="mt-5">
          <h3>Stress System</h3>
          <textarea value={stressSystem} onChange={ev => setStressSystem(ev.currentTarget.value)} />
        </div>
      </Modal.Body>
    </Modal>
  );
}