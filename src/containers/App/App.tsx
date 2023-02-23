import React from 'react';
import './App.scss';

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ROUTES } from './App.routes';
import { Root } from './Root';


function App() {
  const router = createBrowserRouter(createRoutesFromElements(ROUTES.map(route => <Route {...route} element={<Root>{route.element}</Root>}></Route>)));
  return (
    <RouterProvider router={router} fallbackElement={<div />} />
  );
}

export default App;
