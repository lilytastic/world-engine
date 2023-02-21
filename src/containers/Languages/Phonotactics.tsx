

import React, { useEffect, useState } from 'react';
import './Languages.scss';
import { ILanguage } from './sounds.model';


import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IPhonology } from './phonology.helpers';

export function Phonotactics(props: {children?: any, language: ILanguage, show: boolean, handleClose?: (arg0: IPhonology) => void}) {

  const [stressSystem, setStressSystem] = useState(props.language.phonology.stressSystem);
  //const [rules, setRules] = useState(props.language.phonology.rules);
  const [morphology, setMorphology] = useState(props.language.phonology.syllableShape);
  const [phonotactics, setPhonotactics] = useState(props.language.phonology.phonotactics);
  const {show} = props;

  const compilePhonology = (): IPhonology => {
    return {
      syllableShape: morphology,
      phonotactics,
      stressSystem
    };
  }

  return (
    <Modal show={show} onHide={() => props.handleClose?.(compilePhonology())}>
      <Modal.Header>
        <Modal.Title>Phonology</Modal.Title>
        <Button onClick={() => props.handleClose?.(compilePhonology())}>Done</Button>
      </Modal.Header>

      <Modal.Body>
        <div className='pt-3 pb-5'>
          <h3 className='mt-0'>Syllable Shape</h3>
          <input value={morphology} onChange={ev => setMorphology(ev.currentTarget.value)} />

          <h3>Phonotactics</h3>
          <textarea value={phonotactics?.map(x => x.script).join('\n') ?? ''} onChange={ev => setPhonotactics(ev.currentTarget.value.split('\n').map(x => ({script: x})))} />

          {/*
          <div className="d-grid gap-2">
            {showRules(props.language.vowels, [SoundPositions.Start, SoundPositions.Nucleus, SoundPositions.Close])}
            <div></div>
            {showRules(props.language.consonants, [SoundPositions.Start, SoundPositions.Onset, SoundPositions.Coda, SoundPositions.Close])}
          </div>
          */}

          <h3>Stress System</h3>
          <textarea value={stressSystem} onChange={ev => setStressSystem(ev.currentTarget.value)} />
        </div>
      </Modal.Body>
    </Modal>
  );
}