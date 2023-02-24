import React from 'react';
import { Language } from '../Language/Language';
import { Languages } from '../Languages/Languages';

export const ROUTES = [
  {
    path: '/', 
    itle: '',
    element: <div></div> },
  { 
    path: '/geography',
    title: 'Geography',
    icon: 'mountain',
    showInNav: true,
    element: <div></div>
  },
  { 
    path: '/cultures',
    title: 'Cultures',
    icon: 'landmark',
    showInNav: true,
    element: <div></div>
  },
  { 
    path: '/languages',
    title: 'Languages',
    icon: 'book',
    showInNav: true,
    element: <Languages />,
    routes: [
      { 
        path: '/languages/:id',
        title: 'Language',
        icon: 'book',
        showInNav: true,
        element: <Language />
      }
    ]
  },
  { 
    path: '/characters',
    title: 'Characters',
    icon: 'users',
    showInNav: true,
    element: <div></div>
  },
];
