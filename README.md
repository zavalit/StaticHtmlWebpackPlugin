[![Build Status](https://travis-ci.org/zavalit/StaticHtmlWebpackPlugin.svg)](http://travis-ci.org/zavalit/StaticHtmlWebpackPlugin)
# Static Html Webpack plugin

It's a webpack plugin that aims to make static html generation as simple and transparent as possible.

You may want to get use of it if your are care of:
- SEO
- Better performance
- Decoupling Frontend from Backend by design

#### Configuration
It's nothing more as just provide a plugin instance and ensure that your output's *libraryTarget*
is equal to **umd** API. It should be enough to enable plugin to do his work.

```
// webpack.config.js

var StaticHtml = require("static-html-webpack-plugin");

module.exports = {
  entry: {
    server: __dirname + '/index.js'
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  plugins: [new StaticHtml()]
}

```
Plugin takes following options:

```
- htmlFilename: name of html file, that have to be generated (default is "index.html"),
- prependDoctypeHtml: set "<!DOCTYPE html>" before your html (default is true),
- appendHash: append hash to css and script files (default is true)

```
To manipulate Plugin Options just provide it to Plugin instance like that:
```
 plugins: [new StaticHtml({appendHash: false})]

```


You may have noticed, that **entry** applies an object with a key/value pair ```server: __dirname + '/index.js'``` that is where all static generation relevant staff have to be handled. You are free to extend it with ```... client: __dirname + '/yourclient.js'``` in order to have a library that relies on client's objects like *window.document* that you don't have, when you generate your static html. **StaticHtmlWebpackPlugin** just doesn't care about anything that, is not relevant for server-side html generation, all it looks for is a **entry.server** key.

To provide your actual html you have to point to it:
```
// index.js

module.exports = "
<html>
  <head>
    <title>Static Html</title>
  </head>
  <body>
    <h1>Hi, i'm so static</h1>
  </body>
</html>
"

```

#### Html based on React routes.

You can also generate a multiple pages at once by providing routes of react-router, for that case you have to provide an object in stead of plain html. The object have to look like this:

```
// index.js

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {RoutingContext, match} from 'react-router';
import routes from './routes.js';


module.exports = {

  'react-router' : {

    getPaths: function(parser){
      return parser(routes)
    },

    buildHtml: function(path, callback){
       match({ routes, location: path }, (error, redirectLocation, renderProps) => {
         callback(renderToStaticMarkup(<RoutingContext {...renderProps} />))
       })
    }
  }

}

```
and for a sample routes like this:
```
// routes.js
import React from 'react'
import { Route, Link } from 'react-router'

const App = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/about">About</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})

const About = React.createClass({
  render() {
    return <h3>About</h3>
  }
})


module.exports = (
    <Route path="/" component={App}>
      <Route path="about" component={About} />
    </Route>
)

```

It'a also possible to define Routes as an Array, if you don't want to use JSX.

```
module.exports = [
  { path: '/',
    component: App,
    childRoutes: [
      { path: 'about', component: About }
    ]
  }
]
```

you will get 2 html files generated:
```
public/index.html
public/about/index.html
```


#### Extend it.

You can use also write your own generators, just create another addon in ```node_modules/static-html-webpack-plugin/addons``` that has the following sceleton:

```
//youraddon.js
module.exports = {
  getPaths: function(routes){
      let paths = [...];
      ...
      return paths;
  }
}
```

and reference to it in your entry file:
```
//index.js
module.exports = {

  'youraddon' : {

    getPaths: function(parser){
      return parser(routes)
    },

    buildHtml: function(path, callback){

         // your logic to generate an html for a given path and provide it as an argument to a callback function

    }
  }

}

```
