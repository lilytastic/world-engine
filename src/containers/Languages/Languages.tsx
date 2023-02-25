import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Languages.scss';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { addNewLanguage, getLanguages } from './reducers/language.reducer';
import { Outlet, useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

// console.log('loaded', JSON.parse(localStorage.getItem('_language') || '{}'));

export function Languages(props: {children?: any}) {

  const languages = useSelector(getLanguages);
  const location = useLocation();
  const dispatch = useDispatch();

  const addNew = () => {
    dispatch(addNewLanguage());
  }

  return (
    <div className="view py-4">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={3} className='mb-4'>
            <label className='d-flex justify-content-between align-items-baseline'>
              <div className='text-muted'><i className='fas fa-fw fa-book me-2'></i>Languages</div>
              <Button className="rounded-pill px-0" variant='link' onClick={() => addNew()}>
                <i className='fas fa-fw fa-file-circle-plus'></i>
              </Button>
            </label>
            <ListGroup className="flex-column mt-2 rounded-3 border overflow-hidden">
              {languages.ids.map(id => (
                <ListGroup.Item key={id}
                                as={NavLink}
                                className="rounded-0 border-0"
                                active={location.pathname === `/languages/${id}`}
                                to={`/languages/${id}`}>
                  {languages.entities[id]?.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col sm={9}>
            <Outlet />
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}