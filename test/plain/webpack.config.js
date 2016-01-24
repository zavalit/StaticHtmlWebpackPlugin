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
  plugins: [new StaticHtml({prependDoctypeHtml:false})]
}
