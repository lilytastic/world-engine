import React from 'react';
import './Nav.scss';

import { NavLink, useLocation } from 'react-router-dom';

function Nav(props: {routes: {path: string, icon: string}[]}) {
  const location = useLocation();
  
  return (
    <nav className={`nav column page--${props.routes.findIndex(x => x.path === location.pathname) + 1}`}>
      <ul className="list">
        {props.routes.map((route, i) => (
          <li key={i} className="navlink">
            <NavLink to={route.path}><i className={`fas fa-${route.icon}`}></i></NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
