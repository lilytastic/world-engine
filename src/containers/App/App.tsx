import React from 'react';
import './App.scss';

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ROUTES } from './App.routes';
import { Root } from '../Root/Root';
import { Provider } from 'react-redux';
import { store } from './store';


function App() {
  const router = createBrowserRouter(createRoutesFromElements(ROUTES.map(route => <Route {...route} element={<Root>{route.element}</Root>}></Route>)));
  return (
    <Provider store={store}>
      <RouterProvider router={router} fallbackElement={<div />} />
    </Provider>
  );
}

export default App;
