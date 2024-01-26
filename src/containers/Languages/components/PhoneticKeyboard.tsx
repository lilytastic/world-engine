import React, { MouseEvent, useState } from 'react';
import { Button, Dropdown } from "react-bootstrap";
import { CONSONANTS } from '../data/consonants';
import { VOWELS } from '../data/vowels';
import { MANNERS, PLACES, TypedSound, VOWELCLOSENESS, VOWELFRONTNESS } from '../models/sounds.model';
import { capitalize } from 'rot-js/lib/util';
// import audio from '../../../assets/audio';

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

  const [consonantViewType, setConsonantViewType] = useState('Place');
  const [vowelViewType, setVowelViewType] = useState('Frontness');

  const speakCharacter = (ev: MouseEvent, sound: TypedSound) => {
    const voiceStr = sound.voiced ? 'voiced' : 'voiceless';
    if (sound.audio) {
      let audio = new Audio(`${process.env.PUBLIC_URL}/audio/${sound.audio}`);
      console.log(sound.audio);
      audio.play();
    } else  if (sound.type === 'consonant') {
      const soundAttributes = [sound.place.toLowerCase(), sound.manner.toLowerCase()].map(x => x.replace(/(non-sibilant\s)/g, 'non-sibilant_'));
      let tokens = [voiceStr, ...soundAttributes];
      tokens[0] = capitalize(tokens[0]);
      let audioName = `${tokens.join('_')}.ogg.mp3`;
      let audio = new Audio(`${process.env.PUBLIC_URL}/audio/${audioName}`);
      console.log(audioName);
      audio.play().then(res => {
        // Success
      }).catch(err => {
        tokens = [...soundAttributes];
        tokens[0] = capitalize(tokens[0]);
        audioName = `${tokens.join('_')}.ogg.mp3`;
        let audio2 = new Audio(`${process.env.PUBLIC_URL}/audio/${audioName}`);
        audio2.play();
        console.log(audioName);
      });
    }
  }

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

  const selectSound = (ev: MouseEvent, sound: TypedSound) => {
    speakCharacter(ev, sound);
    typeCharacter(ev, sound.phoneme);
  }

  return (<div>
    <label className='text-muted d-flex justify-content-between align-items-center'>
      Vowels
      <Dropdown>
        <Dropdown.Toggle size='sm' variant='link' className='link-secondary text-decoration-none'>
          {vowelViewType} <i className='fas fa-list ms-2'></i>
        </Dropdown.Toggle>
        <Dropdown.Menu defaultValue={'Closeness'}>
          <Dropdown.Header className='pt-0 pb-1'>View by</Dropdown.Header>
          <Dropdown.Item active={vowelViewType === 'Closeness'} variant='link' onClick={ev => setVowelViewType('Closeness')}>Closeness</Dropdown.Item>
          <Dropdown.Item active={vowelViewType === 'Frontness'} variant='link' onClick={ev => setVowelViewType('Frontness')}>Frontness</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </label>
    <div>    
      {vowelViewType === 'Closeness' ? (
        VOWELCLOSENESS.map(t => (
          <div key={t.key} className='d-grid align-items-start' style={{gridTemplateColumns: '25% 1fr', gridAutoFlow: 'row'}}>
            <label className='small me-2 overflow-hidden' style={{marginTop: '0.2em', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{t.name}</label>
            <div>
              {VOWELS.filter(x => x.openness === t.key).reverse().map(sound =>
                <Button key={sound.phoneme}
                        className='d-inline p-0 me-1 text-decoration-none lh-1'
                        onMouseDown={ev => selectSound(ev, sound)}
                        variant='link'>
                  {sound.phoneme}
                </Button>
              )}
            </div>
          </div>
        ))
      ) : (
        VOWELFRONTNESS.map(t => (
          <div key={t.key} className='d-grid align-items-start' style={{gridTemplateColumns: '25% 1fr', gridAutoFlow: 'row'}}>
            <label className='small me-2 overflow-hidden' style={{marginTop: '0.2em', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{t.name}</label>
            <div>
              {VOWELS.filter(x => x.frontness === t.key).reverse().map(sound =>
                <Button key={sound.phoneme}
                        className='d-inline p-0 me-1 text-decoration-none lh-1'
                        onMouseDown={ev => selectSound(ev, sound)}
                        variant='link'>
                  {sound.phoneme}
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
    <hr />
    <label className='text-muted d-flex justify-content-between align-items-center'>
      Consonants
      <Dropdown>
        <Dropdown.Toggle size='sm' variant='link' className='link-secondary text-decoration-none'>
          {consonantViewType} <i className='fas fa-list ms-2'></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header className='pt-0 pb-1'>View by</Dropdown.Header>
          <Dropdown.Item active={consonantViewType === 'Place'} variant='link' onClick={ev => setConsonantViewType('Place')}>Place</Dropdown.Item>
          <Dropdown.Item active={consonantViewType === 'Manner'} variant='link' onClick={ev => setConsonantViewType('Manner')}>Manner</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </label>
    <div>
      {consonantViewType === 'Place' ? (
        PLACES.map(place => (
          <div key={place.key} className='d-grid align-items-start' style={{gridTemplateColumns: '25% 1fr', gridAutoFlow: 'row'}}>
            <label className='small me-2 overflow-hidden' style={{marginTop: '0.2em', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{place.name}</label>
            <div>
              {CONSONANTS.filter(x => x.place === place.key).map(consonant =>
                <Button key={consonant.phoneme}
                        className='d-inline p-0 me-1 text-decoration-none lh-1'
                        onMouseDown={ev => selectSound(ev, consonant)}
                        variant='link'>
                  {consonant.phoneme}
                </Button>
              )}
            </div>
          </div>
        ))
      ) : (
        MANNERS.filter(manner => CONSONANTS.filter(x => x.manner === manner.key).length > 0).map(manner => (
          <div key={manner.key} className='d-grid align-items-start' style={{gridTemplateColumns: '25% 1fr', gridAutoFlow: 'row'}}>
            <label className='small me-2 overflow-hidden' style={{marginTop: '0.2em', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{manner.name}</label>
            <div>
              {CONSONANTS.filter(x => x.manner === manner.key).map(consonant =>
                <Button key={consonant.phoneme}
                        className='d-inline p-0 me-1 text-decoration-none lh-1'
                        onMouseDown={ev => selectSound(ev, consonant)}
                        variant='link'>
                  {consonant.phoneme}
                </Button>
              )}
            </div>
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
  </div>);
}