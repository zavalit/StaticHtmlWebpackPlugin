import webpack from 'webpack'
import webpackRunner from '../webpack-runner.js'
import expect from 'expect';


describe("Build html file based on react routing", function(){
 
  it("creates @react-router pages based on @jsx", function(done){

    webpackRunner(require('./webpack.config.js')[0], function(fs, hash){

      var app = fs.readFileSync(__dirname + "/testoutput/index.html", "utf8");
      expect(app).toBe('<div><link rel="stylesheet" media="screen,projection" type="text/css" href="/client.css?'+hash+'"/><link    href="/clie[n]+sas_t.css?sdkj&'+hash+'"/><h1>App</h1><script src="/client.js?'+hash+'"></script><script src="/clie[n]+sas_t.js?sdkj&'+hash+'"></script></div>');

      var about = fs.readFileSync(__dirname + "/testoutput/about/index.html", "utf8");
      expect(about).toBe('<div><link rel="stylesheet" media="screen,projection" type="text/css" href="/client.css?'+hash+'"/><link    href="/clie[n]+sas_t.css?sdkj&'+hash+'"/><h1>App</h1><div>About</div><script src="/client.js?'+hash+'"></script><script src="/clie[n]+sas_t.js?sdkj&'+hash+'"></script></div>');


    }, done)
  })
  it("creates @react-router pages based on @array config", function(done){
    webpackRunner(require('./webpack.config.js')[1], function(fs, hash){

      var app = fs.readFileSync(__dirname + "/testoutput/index.html", "utf8");
      expect(app).toBe('<div><link href="/client.css" type="text/css" rel="stylesheet" media="screen,projection"/><link href="/clie[n]+sas_t.css?sdkj"/><h1>App</h1><script src="/client.js"></script><script src="/clie[n]+sas_t.js?sdkj"></script></div>')

      var about = fs.readFileSync(__dirname + "/testoutput/about/index.html", "utf8");
      expect(about).toBe('<div><link href="/client.css" type="text/css" rel="stylesheet" media="screen,projection"/><link href="/clie[n]+sas_t.css?sdkj"/><h1>App</h1><div>About</div><script src="/client.js"></script><script src="/clie[n]+sas_t.js?sdkj"></script></div>');


    }, done)
  })
})
