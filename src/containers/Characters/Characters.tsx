import React from 'react';
// import './Characters.scss';

import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { addNewCharacter, getCharacters } from './character.reducers';
import { NavLink } from 'react-router-dom';

// console.log('loaded', JSON.parse(localStorage.getItem('_character') || '{}'));

export function Characters(props: {children?: any}) {

  const characters = useSelector(getCharacters);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useNavigate();

  return (
    <Container fluid='sm'>
      <div className="view py-3">
        <label className='mb-2 pb-1'>
          &nbsp;
        </label>
        <Row className='mt-2'>
          <Col xs={12} md={6} lg={7}>
            <div className='w-100'>
              <Outlet />
            </div>
          </Col>
          <Col xs={12} md={6} lg={5}>
            <ListGroup className="flex-column overflow-hidden w-100 w-sm-75">
              <ListGroup.Item action
                              variant='primary'
                              onClick={() => dispatch(addNewCharacter({history})) }>
                <i className='fas fa-fw fa-sm fa-file-circle-plus me-2'></i>
                Create New Character
              </ListGroup.Item>
              {characters.ids.map(id => (
                <ListGroup.Item key={id}
                                as={NavLink}
                                to={`/characters/${id}`}
                                action
                                active={location.pathname === `/characters/${id}`}>
                  {characters.entities[id]?.name || 'Untitled'}
                  {characters.entities[id]?.gender === 'M' ? '♂' : characters.entities[id]?.gender === 'F' ? '♀' : ''}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </div>
    </Container>
  );
}