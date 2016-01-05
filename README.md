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

var StaticHtml = require("static-html-webapck-plugin");

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
You may have noticed, that **entry** applies an object with a key/value pair ```server: __dirname + '/index.js'``` that is where all static generation relevant staff have to be handled. You are free to extend it with ```... client: __dirname + '/yourclient.js'``` in order to have a library that relies on client's objects like *window.document* that you don't have, when you generate your static html, **StaticHtmlWebpackPlugin** just doesn't care, all it looks for is a *server* key.

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
