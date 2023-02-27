import React, { useEffect, useState } from 'react';
import { IConsonant, IVowel, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS } from '../models/sounds.model';
import { VOWELS } from '../data/vowels';
import { CONSONANTS } from '../data/consonants';


import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import { ILanguage } from '../models/language.model';

export function SoundSelection(props: {children?: any, language: ILanguage, show: boolean, handleClose?: (vowels: IVowel[], consonants: IConsonant[]) => void}) {

  const [chosenVowels, setChosenVowels] = useState(props.language.vowels);
  const [chosenConsonants, setChosenConsonants] = useState(props.language.consonants);
  const {show} = props;

  return (
    <Modal show={show} fullscreen={true} onHide={() => props.handleClose?.(chosenVowels, chosenConsonants)}>
      <Modal.Header>
        <Modal.Title>Sound Selection</Modal.Title>
        <CloseButton variant="white" onClick={() => props.handleClose?.(chosenVowels, chosenConsonants)}></CloseButton>
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
                        <button key={sound.phoneme}
                                onClick={() => !chosenVowels.find(x => x.phoneme === sound.phoneme)
                                  ? setChosenVowels([...chosenVowels, sound])
                                  : setChosenVowels([...chosenVowels.filter(x => x.phoneme !== sound.phoneme)])}
                                className={`btn btn-link ${!!chosenVowels.find(x => x.phoneme === sound.phoneme) ? 'text-primary' : 'text-secondary'}`}>
                          {sound.phoneme}
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
                        <button key={sound.phoneme}
                                onClick={() => !chosenConsonants.find(x => x.phoneme === sound.phoneme)
                                  ? setChosenConsonants([...chosenConsonants, sound])
                                  : setChosenConsonants([...chosenConsonants.filter(x => x.phoneme !== sound.phoneme)])}
                                className={`btn btn-link ${!!chosenConsonants.find(x => x.phoneme === sound.phoneme) ? 'text-primary' : 'text-secondary'}`}>
                          {sound.phoneme}
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