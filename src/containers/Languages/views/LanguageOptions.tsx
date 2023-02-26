import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { ILanguage } from '../models/sounds.model';
import { addNewLanguage } from '../reducers/language.reducer';


export const LanguageOptions = (props: {children?: any, language: ILanguage, className?: string}) => {

  const {language} = props;

  const dispatch = useDispatch();

  return (
    <Dropdown className={props.className}>
      <Dropdown.Toggle variant='outline-secondary' className='rounded-pill' id="dropdown-basic">
        <i className='fas fa-gear me-2'></i>Options
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
          <i className='fas fa-user-group fa-sm fa-fw me-2'></i>
          Change Parent
        </Dropdown.Item>
        <Dropdown.Item onClick={ev => dispatch(addNewLanguage({name: language.name, parent: language.id}))}>
          <i className='fas fa-user-plus fa-sm fa-fw me-2'></i>
          Add Child
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item as={Button}
                      onClick={ev => {}}
                      className='btn btn-link text-danger'>
          <i className='fas fa-trash fa-fw fa-sm me-2'></i>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}