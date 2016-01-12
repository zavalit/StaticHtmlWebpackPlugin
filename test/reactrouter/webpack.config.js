var StaticHtml = require("../../index.js");

module.exports = {
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
}
