import React, { useEffect, useState } from 'react';
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ProbabilityType } from '../helpers/logic.helpers';
import { ILanguage } from '../models/language.model';
import { getLanguages, updateLanguage } from '../reducers/language.reducer';


export const ProbabilityDropoff = (props: {children?: any, className?: string}) => {

  const languages = useSelector(getLanguages);
  const dispatch = useDispatch();
  const [language, setLanguage] = useState(undefined as ILanguage | undefined);
  const [currentDropoffRate, setDropoffRate] = useState(undefined as ProbabilityType | undefined);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const language = languages.entities[params.id];
      if (language) {
        setLanguage(language);
        setDropoffRate(language.phonology.dropoffRate);  
      }
    }
  }, [languages, params.id]);

  const updateDropoffRate = (dropoffRate: ProbabilityType) => {
    dispatch(updateLanguage({...language, phonology: {...language?.phonology, dropoffRate}}));
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ul className='list'>
          <li>Phonemes are ranked by frequency from left (most frequent) to right (least frequent).</li>
          <li><b>Fast</b> rate makes frequent phonemes even more frequent, <b>Medium</b> creates a more even spread, and <b>Equiprobable</b> creates a perfectly even spread.</li>
          <li>When using Equiprobable, phonemes can be custom weighted by writing *multiplier. For example, p*10 makes p ten times more common than a phoneme without a multiplier. To make it less likely, multiply by a decimal: p*0.4.</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (<>
    <Form.Label htmlFor="dropoffRate" className='d-flex align-items-center'>
      Probability Dropoff Rate
      <OverlayTrigger trigger="focus" placement='bottom' overlay={popover}>
        <Button variant='link' className='p-0 small text-secondary'>
          <i className='fas fa-circle-question small ms-2'></i>
        </Button>
      </OverlayTrigger>
    </Form.Label>
    <div className='mb-2'>
      <Form.Check
        label="Fast dropoff"
        checked={currentDropoffRate === ProbabilityType.FastDropoff}
        onChange={ev => updateDropoffRate(ProbabilityType.FastDropoff)}
        name="group1"
        type='radio'
        id='inline-type-1'
      />
      <Form.Check
        label="Medium dropoff"
        checked={currentDropoffRate === ProbabilityType.MediumDropoff}
        onChange={ev => updateDropoffRate(ProbabilityType.MediumDropoff)}
        name="group1"
        type='radio'
        id='inline-type-2'
      />
      <Form.Check
        label="Equiprobable"
        checked={currentDropoffRate === ProbabilityType.Equiprobable}
        onChange={ev => updateDropoffRate(ProbabilityType.Equiprobable)}
        name="group1"
        type='radio'
        id='inline-type-3'
      />
      {/*
      <ButtonGroup className='w-100'>
        <Button active={currentDropoffRate === ProbabilityType.FastDropoff}
                onClick={ev => updateDropoffRate(ProbabilityType.FastDropoff)}
                variant='secondary'
                className='w-100'>
          Fast
        </Button>
        <Button active={currentDropoffRate === ProbabilityType.MediumDropoff}
                onClick={ev => updateDropoffRate(ProbabilityType.MediumDropoff)}
                variant='secondary'
                className='w-100'>
          Medium
        </Button>
        <Button active={currentDropoffRate === ProbabilityType.Equiprobable}
                onClick={ev => updateDropoffRate(ProbabilityType.Equiprobable)}
                variant='secondary'
                className='w-100'>
          Equiprobable
        </Button>
      </ButtonGroup>
      */}
    </div>
  </>);
}
