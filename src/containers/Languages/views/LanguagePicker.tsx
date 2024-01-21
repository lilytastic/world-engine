import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { addNewLanguage, getLanguages } from '../reducers/language.reducer';


export const LanguagePicker = (props: {children?: any, className?: string}) => {

  const languages = useSelector(getLanguages);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useNavigate();

  return (<div>
    <label className='mb-2 pb-1'>
      &nbsp;
    </label>
    <h1 className='lh-1 mb-3'>
      Languages
    </h1>
    <Row className='mt-2'>
      <Col xs={12} md={6} lg={7}>
        <div className='w-100 mb-3' style={{maxWidth: '400px'}}>
          Generate sound systems with unique rules. Create names, words, and dictionaries to help flesh out your cultures and maps.
        </div>
      </Col>
      <Col xs={12} md={6} lg={5}>
        <ListGroup className="flex-column overflow-hidden w-100 w-sm-75">
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
      </Col>
    </Row>
  </div>);
}
