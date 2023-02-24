

import React, { useState } from 'react';
import { ILanguage, IPhonology } from '../models/sounds.model';


import Offcanvas from 'react-bootstrap/Offcanvas';
import CloseButton from 'react-bootstrap/CloseButton';
import { Phonotactic } from './Phonotactic';

export function Phonotactics(props: {children?: any, language: ILanguage, show: boolean, handleClose?: (arg0: IPhonology) => void}) {

  const [stressSystem, setStressSystem] = useState(props.language.phonology.stressSystem);
  //const [rules, setRules] = useState(props.language.phonology.rules);
  const [morphology, setMorphology] = useState(props.language.phonology.syllableShape);
  const [phonotactics, setPhonotactics] = useState(props.language.phonology.phonotactics);
  const [phonemeClasses, setPhonemeClasses] = useState(props.language.phonology.phonemeClasses);
  const [isEditingPhonotatic, editPhonotatic] = useState(0);
  const {show} = props;

  const compilePhonology = (): IPhonology => {
    return {
      syllableShape: morphology,
      phonotactics,
      phonemeClasses,
      stressSystem
    };
  }
  const addPhonotactic = () => {
    const id = Math.max(0, ...phonotactics.map(x => x.id)) + 1;
    setPhonotactics([...phonotactics, {
      id,
      type: '',
      description: '',
      script: 'test'
    }]);
    editPhonotatic(id);
  }

  return (
    <Offcanvas show={show} placement={'end'} onHide={() => props.handleClose?.(compilePhonology())}>
      <Offcanvas.Header>
        <Offcanvas.Title>Phonology</Offcanvas.Title>
        <CloseButton variant="white" onClick={() => props.handleClose?.(compilePhonology())}></CloseButton>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <div className='pt-3 pb-5'>
          <div className="form-group mb-3">
            <label>Syllable Shape</label>
            <textarea value={morphology} onChange={ev => setMorphology(ev.currentTarget.value)}></textarea>
          </div>

          <div className="form-group mb-3">
            <label>Rules</label>
            {/*
            <textarea value={phonotactics?.map(x => x.script).join('\n') ?? ''} onChange={ev => setPhonotactics(ev.currentTarget.value.split('\n').map(x => ({script: x})))} />
            */}
            <div className='mb-3 mt-2'>
              {phonotactics?.map(rule => {
                return (<button key={rule.id} className='btn btn-dark my-1 py-2 w-100 text-start' onClick={ev => editPhonotatic(rule.id)}>
                  <div className='text-muted'>{rule.id}) {rule.description || 'No description'}</div>
                  {rule.script}
                </button>);
              })}
            </div>
            <button className='btn btn-primary btn-sm d-block' onClick={ev => addPhonotactic()}>Add</button>
          </div>
          <Phonotactic language={props.language}
                       show={isEditingPhonotatic !== 0}
                       phonotactic={phonotactics.find(x => x.id === isEditingPhonotatic) || undefined}
                       handleClose={ev => {setPhonotactics(phonotactics.map(x => x.id === isEditingPhonotatic ? ev : x)); editPhonotatic(0)}}
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
      </Offcanvas.Body>
    </Offcanvas>
  );
}