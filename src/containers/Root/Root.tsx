import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ROUTES } from '../App/App.routes';
import { NavLink } from 'react-router-dom';

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
    <Navbar className='bg-body' sticky="top" expand="lg">
      <Container fluid='sm'>

        <Navbar.Brand href="/" className='w-10'>
          <i className='fas fa-globe me-2'></i>
          <strong>World Engine</strong>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='border-0' />
        <Navbar.Offcanvas id="responsive-navbar-nav">
          <div className='d-block d-md-flex'>
            <Nav defaultActiveKey="/" activeKey={location.pathname} className='align-items-center justify-content-end mx-auto'>
              {ROUTES.filter(route => route.showInNav).map(route => (
                <Nav.Item key={route.path} className="ms-3">
                  <Nav.Link as={NavLink} to={route.path}>
                    <i className={`fas fa-${route.icon} me-2`}></i>
                    <span>{route.title}</span>
                  </Nav.Link>
                </Nav.Item>
              ))}
              {/*
              <button className={`ms-3 px-2 rounded-pill align-self-center btn-link link-warning btn btn-${theme}`} onClick={ev => setTheme(theme === 'light' ? 'dark' : 'light')}>
                <i className={`fas fa-fw fa-${theme === 'light' ? 'sun' : 'moon'}`}></i>
              </button>
              */}
            </Nav>

            <div className='d-flex ms-2 align-items-center justify-content-end'>
              <div className="form-check form-switch mt-1">
                <input className="form-check-input bg-warning border-0"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckChecked"
                      checked={theme === 'light'}
                      onChange={ev => setTheme(!ev.currentTarget.checked ? 'dark' : 'light')}
                />
                <i className={`fas fa-fw me-1 fa-sm fa-${theme === 'dark' ? 'moon' : 'sun'}`}></i>
              </div>
            </div>
          </div>
        </Navbar.Offcanvas>

      </Container>
    </Navbar>
    <Container fluid='sm'>
      <div className="main">{props.children}</div>
    </Container>
  </div>);
}