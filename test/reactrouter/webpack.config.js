var StaticHtml = require("../../index.js");

module.exports = [
// check jsx
{
  entry: {
    server: __dirname + '/index.js'
  },
  output: {
    path: __dirname + '/testoutput',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, loader: 'babel'}
    ]
  },
  plugins: [new StaticHtml()]
},
// check array
{  entry: {
    server: __dirname + '/index_array.js'
  },
  output: {
    path: __dirname + '/testoutput',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, loader: 'babel'}
    ]
  },
  plugins: [new StaticHtml()]
}
]
