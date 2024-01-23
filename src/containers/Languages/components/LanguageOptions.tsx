import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ILanguage } from '../models/language.model';
import { addNewLanguage, deleteLanguage, updateLanguage } from '../reducers/language.reducer';


export const LanguageOptions = (props: {children?: any, language: ILanguage, scratch: ILanguage | null, className?: string}) => {

  const { language, scratch } = props;

  const dispatch = useDispatch();
  const history = useNavigate();

  return (
    <Dropdown className={props.className}>
      <Button disabled={scratch === null} onClick={() => dispatch(updateLanguage(scratch))}>
        <i className='fas fa-floppy-disk me-2'></i>
        Save
      </Button>
      <Dropdown.Toggle variant='link' id="dropdown-basic">
        <i className='fas fa-ellipsis fa-sm me-2'></i>
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