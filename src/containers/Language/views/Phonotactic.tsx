

import React, { useEffect, useState } from 'react';
import { ILanguage } from '../models/sounds.model';

import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import { IPhonotactic } from '../helpers/phonology.helpers';

export function Phonotactic(props: {children?: any, language: ILanguage, phonotactic?: IPhonotactic, show: boolean, handleClose?: (arg0: IPhonotactic) => void}) {

  const [phonotactic, setPhonotactic] = useState(props.phonotactic);
  const {show} = props;

  const [script, setScript] = useState(props.phonotactic?.script ?? '');
  const [description, setDescription] = useState(props.phonotactic?.description ?? '');

  useEffect(() => {
    if (props.phonotactic) {
      setPhonotactic(props.phonotactic);
      setDescription(props.phonotactic.description);
      setScript(props.phonotactic.script);  
    }
  }, [props.phonotactic]);

  const compilePhonotatic = (): IPhonotactic => {
    return {
      id: (!!props.phonotactic?.id) ? props.phonotactic.id : Math.max(0, ...props.language.phonology.phonotactics.map(x => x.id)) + 1,
      type: props.phonotactic?.type ?? '',
      description,
      script
    };
  }

  return (
    <Modal centered show={show} onHide={() => props.handleClose?.(compilePhonotatic())}>
      <Modal.Header>
        <Modal.Title>Edit Phonotactic</Modal.Title>
        <CloseButton variant="white" onClick={() => props.handleClose?.(compilePhonotatic())}></CloseButton>
      </Modal.Header>

      <Modal.Body>
        <div className='pt-3 pb-5'>
          <div className="form-group mb-3">
            <label>Description</label>
            <input value={description} onChange={ev => setDescription(ev.currentTarget.value)} />
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
