

import React, { useEffect, useState } from 'react';
import { CONSONANTS } from './consonants';
import './Languages.scss';
import { IConsonant, ILanguage, IPhonology, ISound, SoundPositions as SoundPositions, IVowel, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS } from './sounds.model';
import { VOWELS } from './vowels';


import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { generateDefaultRule } from './generators.helpers';

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

  // TODO: Cover all this shit https://en.wikipedia.org/wiki/Phonological_rule

  /*
  const changeRules = (sound: ISound, positions: SoundPositions[]) => {
    const _rules = {...rules};
    if (!_rules[sound.key]) {
      _rules[sound.key] = {...generateDefaultRule(props.language, sound), positionsAllowed: positions}
    } else {
      _rules[sound.key].positionsAllowed = positions;
    }
    console.log(_rules);
    setRules(_rules);
  }

  const showRules = (sounds: ISound[], defaults: SoundPositions[]) => (
    <>
      {sounds.map(sound => (
        <div key={sound.key} className="d-flex align-items-center justify-content-between">
          <div className='mb-1'>
            /<b>{sound.key}</b>/ {(sound.romanization && sound.romanization !== sound.key) ? <>("{sound.romanization}")</> : ''}
          </div>
          <ToggleButtonGroup
              type="checkbox"
              defaultValue={
                rules[sound.key]
                  ? rules[sound.key].positionsAllowed
                  : defaults
              }
              onChange={ev => changeRules(sound, ev)}>
            <ToggleButton className='btn-dark btn-sm' id={`tbg-check-0-${sound.key}`} value={SoundPositions.Start}>
              Open
            </ToggleButton>
            <ToggleButton className='btn-dark btn-sm' id={`tbg-check-1-${sound.key}`} value={SoundPositions.Onset}>
              Onset
            </ToggleButton>
            <ToggleButton className='btn-dark btn-sm' id={`tbg-check-2-${sound.key}`} value={SoundPositions.Nucleus}>
              Nucleus
            </ToggleButton>
            <ToggleButton className='btn-dark btn-sm' id={`tbg-check-3-${sound.key}`} value={SoundPositions.Coda}>
              Coda
            </ToggleButton>
            <ToggleButton className='btn-dark btn-sm' id={`tbg-check-4-${sound.key}`} value={SoundPositions.Close}>
              Close
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      ))}
    </>
  )
  */

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