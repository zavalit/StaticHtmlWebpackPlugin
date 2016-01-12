import React from 'react';
import App from './App.jsx'
import About from './About.jsx'


module.exports = [
  { path: '/',
    component: App,
    childRoutes: [
      { path: 'about', component: About }
    ]
  }
]
