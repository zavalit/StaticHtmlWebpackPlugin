'use strict';

const path = require('path');
const evaluate = require('eval');

const StaticHtml = function(options){

  options = options || {};

  if(typeof(options.outputFilename) === "undefined"){
    options.outputFilename = "server.js";
  }

  if(typeof(options.htmlFilename) === "undefined"){
    options.htmlFilename = "index.html";
  }


  this.options = options;
  this.htmlFilename = options.htmlFilename;
  this.outputFilename = options.outputFilename;

}


StaticHtml.prototype.apply = function(compiler){

  compiler.plugin('emit', this.emit.bind(this));

}

StaticHtml.prototype.emit = function(compilation, done){

  try{

    let render = this.execute(compilation);
    this.buildHtml(compilation, render)

  } catch (err){

    compilation.errors.push(err.stack);

  }

  done();
}

StaticHtml.prototype.buildHtml = function(compilation, render)
{

  if(typeof(render) === "string"){
    compilation.assets[this.getPublicPath(compilation) + this.htmlFilename] = this.create(render);
    return;
  }

  let keys = [];
  for(var k in render) {
    try {

      let addOn = require('./addons/'+k+'.js');
      let addOnRender = render[k];
      addOnRender.getPaths(addOn.getPaths).forEach(function(path){
          addOnRender.buildHtml(path, function(html){
            path = path === "/" ? path + this.htmlFilename : path + '/' +  this.htmlFilename;
            compilation.assets[this.getPublicPath(compilation) + path] = this.create(html);
          }.bind(this));
        }.bind(this));

    }catch(e){
      if(e.code === "MODULE_NOT_FOUND"){
        throw new Error("Unknown static html webpack plugin addon '"+k+"'")
      }
      throw e;
    }
  }

}

StaticHtml.prototype.execute = function(compilation)
{
   if(compilation.options.output.libraryTarget !== 'umd'){
     throw new Error('Your webpack config have to have an output libraryTarget equal to umd');
   }
   let serverJs = this.outputFilename;

   if(typeof(compilation.assets[serverJs]) === "undefined"){
     throw new Error('Webpack\'s entry definition is not valid, check whether it has ' + serverJs.substring(0, serverJs.length - 3) + ' key for your entry file');
   }
   let source = compilation.assets[serverJs].source();
   return  evaluate(source, serverJs, undefined, true);
}

StaticHtml.prototype.getOutputPaths = function(compilation)
{
   return [this.getPublicPath(compilation)];
}

StaticHtml.prototype.getPublicPath = function(compilation){

  let publicPath = typeof compilation.options.output.publicPath !== 'undefined' ?
     compilation.options.output.publicPath : ".";

  if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
   publicPath += '/';
  }

  return publicPath;
}

StaticHtml.prototype.create = function(content){

  return {
    source: function() {
      return content;
    },
    size: function() {
      return content.length;
    }
  };
}



module.exports = StaticHtml;
