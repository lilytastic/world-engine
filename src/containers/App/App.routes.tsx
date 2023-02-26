import React from 'react';
import { Language } from '../Languages/views/Language';
import { Languages } from '../Languages/Languages';
import { LanguagePicker } from '../Languages/views/LanguagePicker';

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
        path: '',
        title: 'Languages',
        element: <LanguagePicker />
      },
      { 
        path: '/languages/:id',
        title: 'Language',
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
