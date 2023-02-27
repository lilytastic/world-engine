import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Form, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ProbabilityType } from '../helpers/logic.helpers';
import { ILanguage } from '../models/sounds.model';
import { getLanguages, updateLanguage } from '../reducers/language.reducer';


export const ProbabilityDropoff = (props: {children?: any, className?: string}) => {

  const languages = useSelector(getLanguages);
  const dispatch = useDispatch();
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const [currentProbabilityDropoff, setProbabilityDropoff] = useState(undefined as ProbabilityType | undefined);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const language = languages.entities[params.id];
      if (language) {
        setLanguage(language);
        setProbabilityDropoff(language.phonology.probabilityDropoff);  
      }
    }
  }, [languages, params.id]);

  const updateProbabilityDropoff = (probabilityDropoff: ProbabilityType) => {
    dispatch(updateLanguage({...language, phonology: {...language?.phonology, probabilityDropoff}}));
  }

  return (<>
    <Form.Label htmlFor="probabilityDropoff">Probability Dropoff Rate</Form.Label>
    <div className='mb-2'>
      <ButtonGroup className='w-100'>
        <Button active={currentProbabilityDropoff === ProbabilityType.FastDropoff}
                onClick={ev => updateProbabilityDropoff(ProbabilityType.FastDropoff)}
                className='w-100'>
          Fast
        </Button>
        <Button active={currentProbabilityDropoff === ProbabilityType.MediumDropoff}
                onClick={ev => updateProbabilityDropoff(ProbabilityType.MediumDropoff)}
                className='w-100'>
          Medium
        </Button>
        <Button active={currentProbabilityDropoff === ProbabilityType.Equiprobable}
                onClick={ev => updateProbabilityDropoff(ProbabilityType.Equiprobable)}
                className='w-100'>
          Equiprobable
        </Button>
      </ButtonGroup>
    </div>
    <Form.Text>
      <ul className='list'>
        <li>Phonemes are ranked by frequency from left (most frequent) to right (least frequent).</li>
        <li><b>Fast</b> rate makes frequent phonemes even more frequent, <b>Medium</b> creates a more even spread, and <b>Equiprobable</b> creates a perfectly even spread.</li>
        <li>When using Equiprobable, phonemes can be custom weighted by writing *multiplier. For example, p*10 makes p ten times more common than a phoneme without a multiplier. To make it less likely, multiply by a decimal: p*0.4.</li>
      </ul>
    </Form.Text>
  </>);
}
