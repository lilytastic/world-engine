import React, { useEffect, useState } from 'react';
import './Languages.scss';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Outlet } from 'react-router';
import { PhoneticKeyboard } from './components/PhoneticKeyboard';

// console.log('loaded', JSON.parse(localStorage.getItem('_language') || '{}'));

export function Languages(props: {children?: any}) {

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
  };

  return (
    <div className="view py-3">
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
    </div>
  );
}