import webpackRunner from '../webpack-runner.js';
import expect from 'expect';

describe('Append raw html string',  function(){

  it('@raw html', function(done){

      webpackRunner(require(__dirname + "/webpack.config.js"), function(fs){

         var html = fs.readFileSync(__dirname + "/testoutput/index.html", "utf8");
         expect(html).toBe("<html></html>")
    }, done);

  })
})
