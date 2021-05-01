import React from 'react';
import './App.scss';

import { Route, Switch, BrowserRouter, NavLink } from 'react-router-dom';
import Nav from '../Nav/Nav';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className={`container container--main px-sm`}>
          <Nav links={[{path: '/geography', icon: 'mountain'}, {path: '/cultures', icon: 'landmark'}, {path: '/characters', icon: 'users'}]} />
        </div>

        <Switch>
          <Route path="/"></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
