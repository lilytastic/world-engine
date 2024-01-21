import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ICharacter } from '../models/character.model';
import { addNewCharacter, deleteCharacter } from '../character.reducers';


export const CharacterOptions = (props: {children?: any, character: ICharacter, className?: string}) => {

  const {character} = props;

  const dispatch = useDispatch();
  const history = useNavigate();

  return (
    <Dropdown className={props.className}>
      <Dropdown.Toggle variant='primary' id="dropdown-basic">
        <i className='fas fa-gear fa-sm me-2'></i>Options<i className='fas fa-caret-down fa-sm ms-2'></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item as={Button}
                      onClick={ev => { dispatch(deleteCharacter({id: character.id})); history('/characters/'); }}
                      className='btn btn-link text-danger'>
          <i className='fas fa-trash fa-fw fa-sm me-2'></i>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}