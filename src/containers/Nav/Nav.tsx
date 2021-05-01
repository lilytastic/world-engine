import React from 'react';
import './Nav.scss';

import { Route, Switch, BrowserRouter, NavLink, useLocation } from 'react-router-dom';

function Nav(props: {links: {path: string, icon: string}[]}) {
  const location = useLocation();
  
  return (
    <nav className={`nav column page--${props.links.findIndex(x => x.path === location.pathname) + 1}`}>
      <ul className="list">
        {props.links.map((link, i) => (
          <li className="navlink">
            <NavLink to={link.path}><i className={`fas fa-${link.icon}`}></i></NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
