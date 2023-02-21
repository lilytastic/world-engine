

import React, { useEffect, useState } from 'react';
import './Languages.scss';
import { ILanguage } from './sounds.model';


import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IPhonology, IPhonotactic } from './phonology.helpers';
import { Phonotactic } from './Phonotactic';

export function Phonotactics(props: {children?: any, language: ILanguage, show: boolean, handleClose?: (arg0: IPhonology) => void}) {

  const [stressSystem, setStressSystem] = useState(props.language.phonology.stressSystem);
  //const [rules, setRules] = useState(props.language.phonology.rules);
  const [morphology, setMorphology] = useState(props.language.phonology.syllableShape);
  const [phonotactics, setPhonotactics] = useState(props.language.phonology.phonotactics);
  const [isEditingPhonotatic, editPhonotatic] = useState(null as IPhonotactic | null);
  const {show} = props;

  const compilePhonology = (): IPhonology => {
    return {
      syllableShape: morphology,
      phonotactics,
      stressSystem
    };
  }

  return (
    <Modal size='lg' show={show} onHide={() => props.handleClose?.(compilePhonology())}>
      <Modal.Header>
        <Modal.Title>Phonology</Modal.Title>
        <Button onClick={() => props.handleClose?.(compilePhonology())}>Done</Button>
      </Modal.Header>

      <Modal.Body>
        <div className='pt-3 pb-5'>
          <div className="form-group mb-3">
            <label>Syllable Shape</label>
            <input value={morphology} onChange={ev => setMorphology(ev.currentTarget.value)} />
          </div>

          <div className="form-group mb-3">
            <label>Rules</label>
            {/*
            <textarea value={phonotactics?.map(x => x.script).join('\n') ?? ''} onChange={ev => setPhonotactics(ev.currentTarget.value.split('\n').map(x => ({script: x})))} />
            */}
            <div className='mb-3 mt-2'>
              {phonotactics?.filter(x => x.script !== '').map(rule => {
                return (<button key={rule.script} className='btn btn-dark my-1 py-2 w-100 text-start' onClick={ev => editPhonotatic(rule)}>
                  <div className='text-muted'>{rule.type || 'Derivative'}</div>
                  {rule.script}
                </button>);
              })}
            </div>
            <button className='btn btn-primary btn-sm d-block'>Add</button>
          </div>
          <Phonotactic language={props.language}
                       show={isEditingPhonotatic !== null}
                       phonotactic={isEditingPhonotatic || undefined}
                       handleClose={ev => {console.log(ev, phonotactics); setPhonotactics(phonotactics.map(x => x.id === ev.id ? ev : x)); editPhonotatic(null)}}
          ></Phonotactic>
          {/*
          <div className="d-grid gap-2">
            {showRules(props.language.vowels, [SoundPositions.Start, SoundPositions.Nucleus, SoundPositions.Close])}
            <div></div>
            {showRules(props.language.consonants, [SoundPositions.Start, SoundPositions.Onset, SoundPositions.Coda, SoundPositions.Close])}
          </div>
          */}
          {/*
          <h3>Stress System</h3>
          <textarea value={stressSystem} onChange={ev => setStressSystem(ev.currentTarget.value)} />
          */}
        </div>
      </Modal.Body>
    </Modal>
  );
}