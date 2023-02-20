import React, { useEffect, useState } from 'react';
import { CONSONANTS } from './consonants';
import './Languages.scss';
import { IConsonant, ILanguage, IVowel, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS } from './sounds.model';
import { VOWELS } from './vowels';


import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export function SoundSelection(props: {children?: any, language: ILanguage, show: boolean, handleClose?: (vowels: IVowel[], consonants: IConsonant[]) => void}) {

  const [chosenVowels, setChosenVowels] = useState(props.language.vowels);
  const [chosenConsonants, setChosenConsonants] = useState(props.language.consonants);
  const {show} = props;

  return (
    <Modal show={show} fullscreen={true} onHide={() => props.handleClose?.(chosenVowels, chosenConsonants)}>
      <Modal.Header>
        <Modal.Title>Sound Selection</Modal.Title>
        <Button onClick={() => props.handleClose?.(chosenVowels, chosenConsonants)}>Done</Button>
      </Modal.Header>

      <Modal.Body>
        <div className='pt-3 pb-5'>
          <h3 className='mt-0'>Vowels</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                {VOWELFRONTNESS.map(place => (<th key={place.key}>{place.name}</th>))}
              </tr>
            </thead>
            <tbody>
              {VOWELCLOSENESS.map((openness) => (
                <tr key={openness.key}>
                  <td>{openness.name}</td>
                  {VOWELFRONTNESS.map(frontness => (
                    <td key={frontness.key}>
                      {VOWELS.filter(sound => !sound.advanced && sound.frontness === frontness.key && sound.openness === openness.key).map(sound => (
                        <button key={sound.key}
                                onClick={() => !chosenVowels.find(x => x.key === sound.key)
                                  ? setChosenVowels([...chosenVowels, sound])
                                  : setChosenVowels([...chosenVowels.filter(x => x.key !== sound.key)])}
                                className={`btn btn-link ${!!chosenVowels.find(x => x.key === sound.key) ? 'text-primary' : 'text-secondary'}`}>
                          {sound.key}
                        </button>
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Pulmonic Consonants</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                {PLACES.map(place => (<th key={place.key}>{place.name}</th>))}
              </tr>
            </thead>
            <tbody>
              {MANNERS.map((manner) => (
                <tr key={manner.key}>
                  <td>{manner.name}</td>
                  {PLACES.map(place => (
                    <td key={place.key}>
                      {CONSONANTS.filter(sound => !sound.advanced && sound.manner === manner.key && sound.place === place.key).map(sound => (
                        <button key={sound.key}
                                onClick={() => !chosenConsonants.find(x => x.key === sound.key)
                                  ? setChosenConsonants([...chosenConsonants, sound])
                                  : setChosenConsonants([...chosenConsonants.filter(x => x.key !== sound.key)])}
                                className={`btn btn-link ${!!chosenConsonants.find(x => x.key === sound.key) ? 'text-primary' : 'text-secondary'}`}>
                          {sound.key}
                        </button>
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}