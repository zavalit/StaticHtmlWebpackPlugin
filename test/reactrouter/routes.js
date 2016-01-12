import React from 'react';
import {Route} from 'react-router';
import App from './App.jsx';
import About from './About.jsx';


const routes = (<Route path="/" component={App}>
  <Route path="about" component={About}/>
</Route>)

module.exports = routes;
