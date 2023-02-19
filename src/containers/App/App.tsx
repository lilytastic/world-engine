import React from 'react';
import './App.scss';

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Nav from '../Nav/Nav';

const ROUTES = [
  {path: '/', icon: 'mountain', element: <Root></Root>},
  {path: '/geography', icon: 'mountain', element: <Root></Root>},
  {path: '/languages', icon: 'book', element: <Root>tiddy</Root>},
  {path: '/cultures', icon: 'landmark', element: <Root></Root>},
  {path: '/characters', icon: 'users', element: <Root></Root>},
];

function Root(props: {children?: any}) {
  return (
    <div className={`container container--main px-sm`}>
      <Nav routes={ROUTES.filter(x => x.path !== '/')} />
      {props.children}
    </div>
  );
}

function App() {
  const router = createBrowserRouter(createRoutesFromElements(ROUTES.map(route => <Route {...route}></Route>)));
  return (
    <div className="App">
      <RouterProvider router={router} fallbackElement={<div />} />
    </div>
  );
}

export default App;
