import React, { useEffect, useState } from 'react';
import './App.scss';

import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ROUTES } from './App.routes';

export function Root(props: {children?: any}) {
  const location = useLocation();
  const [theme, setTheme] = useState((localStorage.getItem('theme') || 'light') as 'light' | 'dark');

  useEffect(() => {
    const bodyNode = document.documentElement as HTMLElement;
    bodyNode.children[1].setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (<div>
    {/*<Nav routes={ROUTES.filter(x => x.path !== '/')} />*/}
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <i className='fas fa-globe me-2'></i>
          <strong>World Engine</strong>
        </Navbar.Brand>
        <div className='d-flex'>
          <Nav defaultActiveKey="/" activeKey={location.pathname}>
            {ROUTES.filter(route => route.showInNav).map(route => (
              <Nav.Item key={route.path} className="ms-3">
                <Nav.Link href={route.path}>
                  <i className={`fas fa-${route.icon} me-2`}></i>
                  <span>{route.title}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <button className={`ms-3 rounded-pill btn btn-${theme}`} onClick={ev => setTheme(theme === 'light' ? 'dark' : 'light')}>
            <i className={`fas fa-fw fa-${theme === 'light' ? 'sun' : 'moon'}`}></i>
          </button>
        </div>
      </Container>
    </Navbar>
    <Container fluid={'sm'}>
      <div className="main pb-5">{props.children}</div>
    </Container>
  </div>);
}