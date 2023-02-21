import React from 'react';
import './App.scss';

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Nav from '../Nav/Nav';
import { Languages } from '../Languages/Languages';
import Container from 'react-bootstrap/Container';
import { Language } from '../Languages/Language';

const ROUTES = [
  {path: '/', icon: 'mountain', element: <div></div>},
  {path: '/geography', icon: 'mountain', element: <div></div>},
  {path: '/cultures', icon: 'landmark', element: <div></div>},
  {path: '/languages', icon: 'book', element: <Language />},
  {path: '/languages/:id', icon: 'book', element: <Language />},
  {path: '/characters', icon: 'users', element: <div></div>},
];

function Root(props: {children?: any}) {
  return (
    <Container fluid={'sm'}>
      <div className='container--main'>
        <Nav routes={ROUTES.filter(x => x.path !== '/')} />
        <div className="main">{props.children}</div>
      </div>
    </Container>
  );
}

function App() {
  const router = createBrowserRouter(createRoutesFromElements(ROUTES.map(route => <Route {...route} element={<Root>{route.element}</Root>}></Route>)));
  return (
    <div className="App">
      <RouterProvider router={router} fallbackElement={<div />} />
    </div>
  );
}

export default App;
