import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { addNewLanguage, getLanguages } from '../reducers/language.reducer';


export const LanguagePicker = (props: {children?: any, className?: string}) => {

  const languages = useSelector(getLanguages);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useNavigate();

  return (<>
    <label className='d-flex justify-content-between align-items-baseline mb-2 pb-1'>
      &nbsp;
    </label>
    <h1 className='d-flex justify-content-between align-items-center lh-1 mb-3'>
      Languages
    </h1>
    <ListGroup className="flex-column mt-2 overflow-hidden">
      <ListGroup.Item action
                      variant='primary'
                      onClick={() => dispatch(addNewLanguage({history})) }>
        <i className='fas fa-fw fa-sm fa-file-circle-plus me-2'></i>
        Create New Language
      </ListGroup.Item>
      {languages.ids.map(id => (
        <ListGroup.Item key={id}
                        as={NavLink}
                        to={`/languages/${id}`}
                        action
                        active={location.pathname === `/languages/${id}`}>
          {languages.entities[id]?.name || 'Untitled'}
        </ListGroup.Item>
      ))}
    </ListGroup>
  </>);
}
