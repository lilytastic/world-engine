import React from 'react';
import { Language } from '../Languages/views/Language';
import { Languages } from '../Languages/Languages';
import { LanguagePicker } from '../Languages/components/LanguagePicker';
import { Simulator } from '../Simulator/Simulator';

export const ROUTES = [
  {
    path: '/', 
    title: '',
    element: <div></div>
  },
  { 
    path: '/geography',
    title: 'Geography',
    icon: 'mountain',
    showInNav: false,
    element: <div></div>
  },
  { 
    path: '/cultures',
    title: 'Cultures',
    icon: 'landmark',
    showInNav: false,
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
    showInNav: false,
    element: <div></div>
  },
  { 
    path: '/simulator',
    title: 'Simulator',
    icon: 'gamepad',
    showInNav: true,
    element: <Simulator />
  },
];
