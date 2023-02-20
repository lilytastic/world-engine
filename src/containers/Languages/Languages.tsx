import { useEffect, useState } from 'react';
import './Languages.scss';
import { Phonotactics } from './Phonotactics';
import { SoundSelection } from './Sounds';
import { IConsonant, ISyllable, IVowel, IWord, ILanguage, DEFAULT_LANGUAGE, MANNERS, PLACES, VOWELCLOSENESS, VOWELFRONTNESS, IPhonotactics, ISound, SoundPositions } from './sounds.model';


export function Languages(props: {children?: any}) {

  const [isSelectingSounds, setIsSelectingSounds] = useState(false);
  const [isEditingPhonotactics, setIsEditingPhonotactics] = useState(false);
  
  const storedLanguage = localStorage.getItem('_language');
  let startingLanguage: ILanguage = DEFAULT_LANGUAGE;
  try {
    if (storedLanguage) {
      startingLanguage = JSON.parse(storedLanguage);
    }
  } catch {
    startingLanguage = DEFAULT_LANGUAGE;
  }

  const [language, setLanguage] = useState(startingLanguage);

  useEffect(() => {
    localStorage.setItem('_language', JSON.stringify(language));
  }, [language]);

  function getRandomSound(sounds: ISound[]) {
    return sounds[Math.floor(Math.random() * sounds.length)];
  }

  function generateWord(language: ILanguage) {
    let length = 1 + Math.floor(Math.random() * 3);
    const morphologyMapped = language.phonotactics.syllableShape.toUpperCase().replace(/\(C\)/g, 'c');
    let syllables: ISyllable[] = [];

    for (let ii = 0; ii < length; ii++) {
      let syllable: ISyllable = {sounds: []};
      const onsetEnd = morphologyMapped.indexOf('V');
      const codaStart = morphologyMapped.lastIndexOf('V');

      for (let i = 0; i < morphologyMapped.length; i++) {
        const token = morphologyMapped[i];
        const isWordStart = ii === 0 && i === 0;
        const isWordClose = ii === length - 1 && i ===  morphologyMapped.length - 1;
        const isOnset = i < onsetEnd;
        const isCoda = i > codaStart;
        let sounds = [...language.vowels.map(x => ({...x, isVowel: true})), ...language.consonants.map(x => ({...x, isVowel: false}))];

        sounds = sounds.filter(sound => {
          let rules = language.phonotactics.rules[sound.key];
          if (!rules) {
            if (sound.isVowel) {
              rules = {
                positionsAllowed: [SoundPositions.Close, SoundPositions.Nucleus, SoundPositions.Start]
              };                
            } else {
              rules = {
                positionsAllowed: [SoundPositions.Close, SoundPositions.Coda, SoundPositions.Onset, SoundPositions.Start]
              };  
            }
          }
  
          if (isWordStart) {
            if (!rules.positionsAllowed.includes(SoundPositions.Start)) {
              return false;
            }
          }
          if (isWordClose) {
            if (!rules.positionsAllowed.includes(SoundPositions.Close)) {
              return false;
            }
          }

          if (token === 'V') {
            if (!rules.positionsAllowed.includes(SoundPositions.Nucleus)) {
              return false;
            }
          } else {
            if (rules.positionsAllowed.includes(SoundPositions.Nucleus)) {
              return false;
            }

            if (isOnset) {
              if (!rules.positionsAllowed.includes(SoundPositions.Onset) && !(isWordStart && rules.positionsAllowed.includes(SoundPositions.Start))) {
                return false;
              }
            } 
            
            if (isCoda) {
              if (!rules.positionsAllowed.includes(SoundPositions.Coda) && !(isWordClose && rules.positionsAllowed.includes(SoundPositions.Close))) {
                return false;
              }
            }
          }
          
          return true;
        });

        if (sounds.length > 0) {
          const sound = getRandomSound(sounds);
          if (token === 'c' && Math.random() * 100 < 50) {
            // ...
          } else {
            syllable.sounds.push(sound);
          }
        } else {
          console.error('No sound found!');
        }
      }
      syllables.push(syllable)
    }

    let word: IWord = {
      syllables
    };
    return word;
  }

  function transcribeWord(word: IWord) {
    return word.syllables.map(syllable => syllable.sounds.map(x => x?.romanization || x?.key || '').join('')).join('');
  }

  function getSampleWords(language: ILanguage) {
    let arr: IWord[] = [];
    if (language.vowels.length === 0 || language.consonants.length === 0) { return arr; }
    for (let i = 0; i < 10; i++) {
      arr.push(generateWord(language));
    }
    return arr;
  }

  function selectSounds(vowels: IVowel[], consonants: IConsonant[]) {
    setLanguage({...language, vowels, consonants});
  }
  function selectPhonotactics(phonotactics: IPhonotactics) {
    setLanguage({...language, phonotactics});
  }

  const frontnessUsed = VOWELFRONTNESS.filter(x => language.vowels.find(y => y.frontness === x.key));
  const opennessUsed = VOWELCLOSENESS.filter(x => language.vowels.find(y => y.openness === x.key));

  const placesUsed = PLACES.filter(x => language.consonants.find(y => y.place === x.key));
  const mannersUsed = MANNERS.filter(x => language.consonants.find(y => y.manner === x.key));

  const listRules = () => {
    return Object.keys(language.phonotactics.rules).map(x => ({key: x, rules: language.phonotactics.rules[x]})).filter(x => !!x.rules);
  }

  const printListExclusive = (list: any[]) => {
    if (list.length === 0) {
      return;
    }
    if (list.length === 1) {
      return list[0];
    }
    if (list.length === 2) {
      return list[0] + ' or ' + list[1];
    }
    return list.slice(0, list.length - 1).join(', ') + ', or ' + list[list.length - 1];
  }

  const printAllRules = () => {
    let applicable = [];

    const cantStart = listRules().filter(x => !x.rules.positionsAllowed.includes(SoundPositions.Start));
    const cantEnd = listRules().filter(x => !x.rules.positionsAllowed.includes(SoundPositions.Close));
    const nonOnset = listRules().filter(x => !x.rules.positionsAllowed.includes(SoundPositions.Onset) && !x.rules.positionsAllowed.includes(SoundPositions.Nucleus));
    const nonCoda = listRules().filter(x => !x.rules.positionsAllowed.includes(SoundPositions.Coda) && !x.rules.positionsAllowed.includes(SoundPositions.Nucleus));

    if (cantStart.length > 0) {
      applicable.push(`Words cannot start with ${printListExclusive(cantStart.map(x => `/<b>${x.key}</b>/`))}.`);
    }
    if (cantEnd.length > 0) {
      applicable.push(`Words cannot end on ${printListExclusive(cantEnd.map(x => `/<b>${x.key}</b>/`))}.`);
    }
    if (nonOnset.length > 0) {
      applicable.push(`${printListExclusive(nonOnset.map(x => `/<b>${x.key}</b>/`))} cannot be used as ${nonOnset.length === 1 ? 'an onset' : 'onsets'}.`);
    }
    if (nonCoda.length > 0) {
      applicable.push(`${printListExclusive(nonCoda.map(x => `/<b>${x.key}</b>/`))} cannot be used as ${nonCoda.length === 1 ? 'a coda' : 'codas'}.`);
    }

    return applicable;
  }

  return (
    <div>
      <SoundSelection language={language} show={isSelectingSounds} handleClose={(vowels, consonants) => {selectSounds(vowels, consonants); setIsSelectingSounds(false);}}></SoundSelection>
      <Phonotactics language={language} show={isEditingPhonotactics} handleClose={(phonotactics) => {selectPhonotactics(phonotactics); setIsEditingPhonotactics(false);}}></Phonotactics>

      <h2 className='mt-0'>Sounds <button className='btn btn-link' onClick={() => setIsSelectingSounds(true)}>Edit</button></h2>
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
                    sound.key
                  ))}
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
                    sound.key
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Phonotactics <button className='btn btn-link' onClick={() => setIsEditingPhonotactics(true)}>Edit</button></h2>
      Syllable shape: [{language.phonotactics.syllableShape}]
      <ul>
        {printAllRules().map(x => (
          <li key={x} dangerouslySetInnerHTML={{__html: x}}></li>
        ))}
      </ul>

      <h2>Specimens</h2>
      <div>
        Sample words: <i>{getSampleWords(language).map(word => transcribeWord(word)).join(', ')}</i>
      </div>
    </div>
  );
}