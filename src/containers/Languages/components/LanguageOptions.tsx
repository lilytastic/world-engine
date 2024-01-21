import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ILanguage } from '../models/language.model';
import { addNewLanguage, deleteLanguage } from '../reducers/language.reducer';


export const LanguageOptions = (props: {children?: any, language: ILanguage, className?: string}) => {

  const {language} = props;

  const dispatch = useDispatch();
  const history = useNavigate();

  return (
    <Dropdown className={props.className}>
      <Dropdown.Toggle variant='primary' id="dropdown-basic">
        <i className='fas fa-file-pen fa-sm me-2'></i>Edit<i className='fas fa-caret-down fa-sm ms-2'></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item as={Button}
                       className='btn btn-link'>
          <i className='fas fa-user-group fa-sm fa-fw me-2'></i>
          Change Parent
        </Dropdown.Item>
        <Dropdown.Item onClick={ev => dispatch(addNewLanguage({language: {name: language.name, parent: language.id}, history}))}
                       as={Button}
                       className='btn btn-link'>
          <i className='fas fa-user-plus fa-sm fa-fw me-2'></i>
          Add Child
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item as={Button}
                      onClick={ev => { dispatch(deleteLanguage({id: language.id})); history('/languages/'); }}
                      className='btn btn-link text-danger'>
          <i className='fas fa-trash fa-fw fa-sm me-2'></i>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}