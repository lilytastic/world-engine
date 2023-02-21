

import React, { useEffect, useState } from 'react';
import './Languages.scss';
import { ILanguage } from './sounds.model';

import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IPhonotactic } from './phonology.helpers';

export function Phonotactic(props: {children?: any, language: ILanguage, phonotactic?: IPhonotactic, show: boolean, handleClose?: (arg0: IPhonotactic) => void}) {

  const [phonotactic, setPhonotactic] = useState(props.phonotactic);
  const {show} = props;

  const [type, setType] = useState(props.phonotactic?.type ?? '');
  const [script, setScript] = useState(props.phonotactic?.script ?? '');

  useEffect(() => {
    if (props.phonotactic) {
      setPhonotactic(props.phonotactic);
      setType(props.phonotactic.type);
      setScript(props.phonotactic.script);  
    }
  }, [props.phonotactic]);

  const compilePhonotatic = (): IPhonotactic => {
    return {
      id: (props.phonotactic?.id ?? '') || ''+(Math.random() * 99999),
      type,
      script
    };
  }

  return (
    <Modal show={show} onHide={() => props.handleClose?.(compilePhonotatic())}>
      <Modal.Header>
        <Modal.Title>Edit Phonotactic</Modal.Title>
        <Button onClick={() => props.handleClose?.(compilePhonotatic())}>Done</Button>
      </Modal.Header>

      <Modal.Body>
        <div className='pt-3 pb-5'>
          <div className="form-group mb-3">
            <label>Type</label>
            <Dropdown className='mt-3' onSelect={ev => !!ev ? setType(ev) : null}>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                {type || 'No type selected'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="Onsets">Onsets</Dropdown.Item>
                <Dropdown.Item eventKey="Codas">Codas</Dropdown.Item>
                <Dropdown.Item eventKey="Derivative">Derivative</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="form-group mb-3">
            <label>Script</label>
            <input value={script} onChange={ev => setScript(ev.currentTarget.value)} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
