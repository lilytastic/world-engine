import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Languages.scss';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { addNewLanguage, getLanguages } from './reducers/language.reducer';
import { Outlet, useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';

// console.log('loaded', JSON.parse(localStorage.getItem('_language') || '{}'));

export function Languages(props: {children?: any}) {

  const languages = useSelector(getLanguages);
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <div className="pt-4">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              {languages.ids.map(id => (
                <Nav.Item className="mb-2" key={id}>
                  <Nav.Link as={NavLink} active={location.pathname === `/languages/${id}`} to={`/languages/${id}`}>{languages.entities[id]?.name}</Nav.Link>
                </Nav.Item>
              ))}
              <hr className='invisible' />
              <Nav.Item as={Button} className="text-start" variant='outline-success' onClick={() => dispatch(addNewLanguage())}>
                <i className='fas fa-plus'></i> &nbsp;Create Language
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Outlet />
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}