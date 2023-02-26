import React, { MouseEvent } from 'react';
import { Button } from "react-bootstrap";
import { CONSONANTS } from '../data/consonants';
import { VOWELS } from '../data/vowels';

const ARTICULATIONS: {phoneme: string, name: string}[] = [
  {name: 'Aspirated', phoneme: 'ʰ'},
  {name: 'Labialized', phoneme: 'ʷ'},
  {name: 'Palatalized', phoneme: 'ʲ'},
  {name: 'Velarized', phoneme: 'ˠ'},
  {name: 'Pharyngealized', phoneme: 'ˤ'},
  {name: 'Lateral release', phoneme: 'ˡ'},
  {name: 'Nasal release', phoneme: 'ⁿ'},
  {name: 'Advanced', phoneme: '˖'},
  {name: 'Retracted', phoneme: '˗'},
];
const TONES: {phoneme: string, name: string}[] = [
  {name: 'Top', phoneme: '꜒'},
  {name: 'High', phoneme: '꜓'},
  {name: 'Mid', phoneme: '꜔'},
  {name: 'Low', phoneme: '꜕'},
  {name: 'Bottom', phoneme: '꜖'},
  {name: 'Downstep', phoneme: 'ꜜ'},
  {name: 'Upstep', phoneme: 'ꜛ'},
];

export const PhoneticKeyboard = (props: {children?: any}) => {

  const typeCharacter = (ev: MouseEvent, str: string) => {
    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    const {value, selectionStart, selectionEnd} = activeElement;
    if (value) {
      if (selectionStart) {
        activeElement.value = value.slice(0, selectionStart) + str + activeElement.value.slice(selectionEnd || selectionStart);
        activeElement.selectionStart = selectionStart + str.length;
        activeElement.selectionEnd = activeElement.selectionStart;
      }
    }
    ev.preventDefault();
  }
  return (<>
    <label className='text-muted'>
      Vowels
    </label>
    <div className='mt-1'>
      {VOWELS.map(vowel => 
        <Button key={vowel.phoneme}
                className='d-inline p-0 me-1 text-decoration-none lh-1'
                onMouseDown={ev => typeCharacter(ev, vowel.phoneme)}
                variant='link'>
          {vowel.phoneme}
        </Button>
      )}
    </div>
    <hr />
    <label className='text-muted'>
      Consonants
    </label>
    <div className='mt-1'>
      {CONSONANTS.map(consonant =>
        <Button key={consonant.phoneme}
                className='d-inline p-0 me-1 text-decoration-none lh-1'
                onMouseDown={ev => typeCharacter(ev, consonant.phoneme)}
                variant='link'>
          {consonant.phoneme}
        </Button>
      )}
    </div>
    <hr />
    <label className='text-muted'>
      Articulation
    </label>
    <div className='mt-1 lh-1 align-middle'>
      {ARTICULATIONS.map((sound, i) => <div className='d-inline' key={sound.phoneme}>
        <Button className='d-inline p-0 me-1 text-decoration-none'
                onMouseDown={ev => typeCharacter(ev, sound.phoneme)}
                variant='link'>
          {sound.name}
        </Button>
        {i < ARTICULATIONS.length - 1 && <>∙&nbsp;</>}
      </div>)}
    </div>
    <hr />
    <label className='text-muted'>
      Tones
    </label>
    <div className='mt-1 lh-1 align-middle'>
      {TONES.map((sound, i) => <div className='d-inline' key={sound.phoneme}>
        <Button className='d-inline p-0 me-1 text-decoration-none'
                onMouseDown={ev => typeCharacter(ev, sound.phoneme)}
                variant='link'>
          {sound.name}
        </Button>
        {i < TONES.length - 1 && <>∙&nbsp;</>}
      </div>)}
    </div>
  </>);
}