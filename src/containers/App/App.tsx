import React from 'react';
import './App.scss';

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ROUTES } from './App.routes';
import { Root } from '../Root/Root';
import { Provider } from 'react-redux';
import { store } from '../Root/store';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(ROUTES.map(route => (
    <Route {...route} element={<Root>{route.element}</Root>}>
      {route.routes?.map(_route => <Route key={_route.path} {..._route} element={_route.element}></Route>)}
    </Route>
  ))));
  return (
    <Provider store={store}>
      <RouterProvider router={router} fallbackElement={<div />} />
    </Provider>
  );
}

export default App;
