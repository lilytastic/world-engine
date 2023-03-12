import React from 'react';
import './Languages.scss';

import { Outlet } from 'react-router';
import { Container } from 'react-bootstrap';

// console.log('loaded', JSON.parse(localStorage.getItem('_language') || '{}'));

export function Languages(props: {children?: any}) {

  return (
    <Container fluid='sm'>
      <div className="view py-3">
        <Outlet />
        {/*
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col xs={12} lg={8}>
              <Outlet />
            </Col>
            <Col sm={6} md={4} className="position-relative overflow-hidden d-none d-lg-block">
              <div style={{transition: 'transform .5s ease-in-out .03s', transform: `translateY(${scrollPosition}px)`}}>
                <PhoneticKeyboard />
              </div>
            </Col>
          </Row>
        </Tab.Container>
        */}
      </div>
    </Container>
  );
}