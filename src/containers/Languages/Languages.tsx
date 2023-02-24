import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Languages.scss';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Language } from '../Language/Language';
import { getLanguages } from '../Language/reducers/language.reducer';

// console.log('loaded', JSON.parse(localStorage.getItem('_language') || '{}'));

export function Languages(props: {children?: any}) {

  const languages = useSelector(getLanguages);

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            {languages.map(language => (
              <Nav.Item key={language.id}>
                <Nav.Link eventKey={language.id}>{language.name}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            {languages.map(language => (
              <Tab.Pane eventKey={language.id} key={language.id}>
                <Language language={language}></Language>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}