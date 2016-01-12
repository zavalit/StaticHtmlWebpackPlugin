import webpack from 'webpack'
import webpackRunner from '../webpack-runner.js'
import expect from 'expect';


describe("Build html file based on react routing", function(){
  it("creates @react-router pages based on @jsx", function(done){

    webpackRunner(require('./webpack.config.js')[0], function(fs){

      var app = fs.readFileSync(__dirname + "/testoutput/index.html", "utf8");
      expect(app).toBe("<div><h1>App</h1></div>")

      var about = fs.readFileSync(__dirname + "/testoutput/about/index.html", "utf8");
      expect(about).toBe("<div><h1>App</h1><div>About</div></div>")


    }, done)
  })
  it("creates @react-router pages based on @array config", function(done){
    webpackRunner(require('./webpack.config.js')[1], function(fs){

      var app = fs.readFileSync(__dirname + "/testoutput/index.html", "utf8");
      expect(app).toBe("<div><h1>App</h1></div>")

      var about = fs.readFileSync(__dirname + "/testoutput/about/index.html", "utf8");
      expect(about).toBe("<div><h1>App</h1><div>About</div></div>")


    }, done)
  })
})
