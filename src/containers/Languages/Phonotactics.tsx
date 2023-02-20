

import React, { useEffect, useState } from 'react';
import { CONSONANTS } from './consonants';
import './Languages.scss';
import { IConsonant, ILanguage, IPhonotactics, IVowel, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS } from './sounds.model';
import { VOWELS } from './vowels';


import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

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
    <Modal show={show} onHide={() => props.handleClose?.(compilePhonotactics())}>
      <Modal.Header>
        <Modal.Title>Phonotactics</Modal.Title>
        <Button onClick={() => props.handleClose?.(compilePhonotactics())}>Done</Button>
      </Modal.Header>

      <Modal.Body>
        <div className='pt-3 pb-5'>
          <h3 className='mt-0'>Syllable Shape</h3>
          <input value={morphology} onChange={ev => setMorphology(ev.currentTarget.value)} />

          <h3>Sound Rules</h3>
          <div className='fst-italic mb-2'>
            TODO: Complex rules for each setting. Indicate with asterisk and lock on.
          </div>
          {/*
          <textarea value={rules} onChange={ev => setRules(ev.currentTarget.value)} />
          */}
          <div className="d-grid gap-2">
            {[...props.language.vowels, ...props.language.consonants].map(sound => (
              <div key={sound.key} className="d-flex align-items-center justify-content-between">
                <div className='mb-1'>
                  <b className="fs-4">{sound.key}</b> {sound.romanization ? <>("{sound.romanization}")</> : ''}
                </div>
                <ToggleButtonGroup type="checkbox" defaultValue={[0, 1, 2, 3, 4]}>
                  <ToggleButton className='btn-dark btn-sm' id={`tbg-check-0-${sound.key}`} value={0}>
                    Word-start
                  </ToggleButton>
                  <ToggleButton className='btn-dark btn-sm' id={`tbg-check-1-${sound.key}`} value={1}>
                    Onset
                  </ToggleButton>
                  <ToggleButton className='btn-dark btn-sm' id={`tbg-check-2-${sound.key}`} value={2}>
                    Nucleus
                  </ToggleButton>
                  <ToggleButton className='btn-dark btn-sm' id={`tbg-check-3-${sound.key}`} value={3}>
                    Coda
                  </ToggleButton>
                  <ToggleButton className='btn-dark btn-sm' id={`tbg-check-4-${sound.key}`} value={4}>
                    Word-finish
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            ))}
          </div>

          <h3>Stress System</h3>
          <textarea value={stressSystem} onChange={ev => setStressSystem(ev.currentTarget.value)} />
        </div>
      </Modal.Body>
    </Modal>
  );
}