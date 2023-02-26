import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { addNewLanguage, getLanguages } from '../reducers/language.reducer';


export const LanguagePicker = (props: {children?: any, className?: string}) => {

  const languages = useSelector(getLanguages);
  const location = useLocation();
  const dispatch = useDispatch();

  return (<>
    <label className='d-flex justify-content-between align-items-baseline'>
      <div className='text-muted'>
        Languages
      </div>
      <Button className="rounded-pill px-0 py-0" variant='link' onClick={() => dispatch(addNewLanguage({}))}>
        <i className='fas fa-fw fa-file-circle-plus'></i>
      </Button>
    </label>
    <ListGroup className="flex-column mt-2 rounded-3 border overflow-hidden">
      <div style={{marginTop: '-1px'}}>
        {languages.ids.map(id => (
          <ListGroup.Item key={id}
                          as={NavLink}
                          action
                          className='rounded-0 border-0 border-top'
                          active={location.pathname === `/languages/${id}`}
                          to={`/languages/${id}`}>
            {languages.entities[id]?.name || 'Untitled'}
          </ListGroup.Item>
        ))}
      </div>
    </ListGroup>
  </>);
}
