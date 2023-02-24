

import React, { useEffect, useState } from 'react';
import { ILanguage } from '../models/sounds.model';


import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';

export function Lexicon(props: {children?: any, language: ILanguage, show: boolean, handleClose?: (arg0: ILanguage) => void}) {

  const [language, setLanguage] = useState(props.language);
  //const [rules, setRules] = useState(props.language.phonology.rules);
  const {show} = props;

  const compileChanges = (): any => {
    return {...language};
  }

  return (
    <Modal centered show={show} onHide={() => props.handleClose?.(compileChanges())}>
      <Modal.Header>
        <Modal.Title>Lexicon</Modal.Title>
        <CloseButton variant="white" onClick={() => props.handleClose?.(compileChanges())}></CloseButton>
      </Modal.Header>

      <Modal.Body>
        <div className='pt-3 pb-5'>

        </div>
      </Modal.Body>
    </Modal>
  );
}