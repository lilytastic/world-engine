

import React, { useEffect, useState } from 'react';
import { ILanguage, MANNERS, PLACES, TypedSound, VOWELCLOSENESS, VOWELFRONTNESS } from '../models/sounds.model';

import { getLanguages, updateLanguage } from '../reducers/language.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { SoundSelection } from './SoundSelection';

export function WordPatterns(props: {children?: any}) {

  const dispatch = useDispatch();
  const languages = useSelector(getLanguages);
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const [currentSounds, setSounds] = useState(undefined as string | undefined);
  const [isSelectingSounds, setIsSelectingSounds] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const language = languages.entities[params.id];
      if (language) {
        setLanguage(language);
        setSounds(language.phonology.wordPatterns);  
      }
    }
  }, [languages, params.id]);

  const updateSounds = (vowels: TypedSound[], consonants: TypedSound[]) => {
    dispatch(updateLanguage({...language, vowels, consonants}));
  }

  if (!language) {
    return <></>;
  }


  const frontnessUsed = VOWELFRONTNESS.filter(x => language.vowels.find(y => y.frontness === x.key));
  const opennessUsed = VOWELCLOSENESS.filter(x => language.vowels.find(y => y.openness === x.key));

  const placesUsed = PLACES.filter(x => language.consonants.find(y => y.place === x.key));
  const mannersUsed = MANNERS.filter(x => language.consonants.find(y => y.manner === x.key));

  return (
    <>
      <SoundSelection
        language={language}
        show={isSelectingSounds}
        handleClose={(vowels, consonants) => {
          updateSounds(vowels, consonants);
          setIsSelectingSounds(false);
        }}
      ></SoundSelection>
      <h2>Sounds <button className='btn btn-link' onClick={() => setIsSelectingSounds(true)}>Edit</button></h2>
      <h4>Vowels</h4>
      {language.vowels.length === 0 && (<i>None yet!</i>)}
      <table>
        <thead>
          <tr>
            <th></th>
            {frontnessUsed.map(place => (<th key={place.key}>{place.name}</th>))}
          </tr>
        </thead>
        <tbody>
          {opennessUsed.map((openness) => (
            <tr key={openness.key}>
              <td>{openness.name}</td>
              {frontnessUsed.map(frontness => (
                <td key={frontness.key}>
                  {language.vowels.filter(sound => sound.frontness === frontness.key && sound.openness === openness.key).map(sound => (
                    sound.phoneme
                  )).join(' ')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <h4>Pulmonic Consonants</h4>
      {language.consonants.length === 0 && (<i>None yet!</i>)}
      <table>
        <thead>
          <tr>
            <th></th>
            {placesUsed.map(place => (<th key={place.key}>{place.name}</th>))}
          </tr>
        </thead>
        <tbody>
          {mannersUsed.map((manner) => (
            <tr key={manner.key}>
              <td>{manner.name}</td>
              {placesUsed.map(place => (
                <td key={place.key}>
                  {language.consonants.filter(sound => sound.manner === manner.key && sound.place === place.key).map(sound => (
                    sound.phoneme
                  )).join(' ')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

