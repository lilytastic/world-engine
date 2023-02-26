import React, { MouseEvent, useState } from 'react';
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";
import { CONSONANTS } from '../data/consonants';
import { VOWELS } from '../data/vowels';
import { MANNERS, PLACES } from '../models/sounds.model';

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

  const [consonantViewType, setConsonantViewType] = useState('manner');

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
    <label className='text-muted d-flex justify-content-between align-items-center'>
      Consonants
      <Dropdown>
        <Dropdown.Toggle size='sm' variant='link'>
          <i className='fas fa-sort'></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item active={consonantViewType === 'place'} variant='link' onClick={ev => setConsonantViewType('place')}>Place</Dropdown.Item>
          <Dropdown.Item active={consonantViewType === 'manner'} variant='link' onClick={ev => setConsonantViewType('manner')}>Manner</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </label>
    <div className='mt-1'>
      {consonantViewType === 'place' ? (
        PLACES.map(place => (
          <div key={place.key} className='d-flex align-items-center'>
            <label className='small me-2 overflow-hidden' style={{width: '25%', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{place.name}</label>
            {CONSONANTS.filter(x => x.place === place.key).map(consonant =>
              <Button key={consonant.phoneme}
                      className='d-inline p-0 me-1 text-decoration-none lh-1'
                      onMouseDown={ev => typeCharacter(ev, consonant.phoneme)}
                      variant='link'>
                {consonant.phoneme}
              </Button>
            )}
          </div>
        ))
      ) : (
        MANNERS.filter(manner => CONSONANTS.filter(x => x.manner === manner.key).length > 0).map(manner => (
          <div key={manner.key} className='d-flex align-items-center'>
            <label className='small me-2 overflow-hidden' style={{width: '25%', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{manner.name}</label>
            {CONSONANTS.filter(x => x.manner === manner.key).map(consonant =>
              <Button key={consonant.phoneme}
                      className='d-inline p-0 me-1 text-decoration-none lh-1'
                      onMouseDown={ev => typeCharacter(ev, consonant.phoneme)}
                      variant='link'>
                {consonant.phoneme}
              </Button>
            )}
          </div>
        ))
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
                size='sm'
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
                size='sm'
                variant='link'>
          {sound.name}
        </Button>
        {i < TONES.length - 1 && <>∙&nbsp;</>}
      </div>)}
    </div>
  </>);
}