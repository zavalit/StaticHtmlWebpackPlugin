'use strict';

const path = require('path');
const evaluate = require('eval');
Object.assign = Object.assign || require('object-assign');

const StaticHtml = function(options){

  this.options = Object.assign({
   outputFilename: "server.js",
   htmlFilename: "index.html",
   prependDoctypeHtml: true,
   appendHash: true,
  }, options);
                                  
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
  
  const hash = compilation.getStats().toJson().hash;

  if(typeof(render) === "string"){
    compilation.assets[this.getPublicPath(compilation) +  '/' +  this.options.htmlFilename] = this.create(render, hash);
    return;
  }

  var keys = [];
  for(var k in render) {
    try {

      var addOn = require('./addons/'+k+'.js');
      var addOnRender = render[k];
      addOnRender.getPaths(addOn.getPaths).forEach(function(path){
          addOnRender.buildHtml(path, function(html){
            
            const htmlFilename = this.options.htmlFilename;
            path = path === "/" ? path + htmlFilename : path + '/' +  htmlFilename;

            compilation.assets[this.getPublicPath(compilation) + path] = this.create(html, hash);

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
   let serverJs = this.options.outputFilename;

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

  return publicPath;
}

StaticHtml.prototype.create = function(content, hash){

  content = this.appendResourcesHash(content, hash);
  content = this.prependDoctypeHtml(content);
  
  return {
    source: function() {
      return content;
    },
    size: function() {
      return content.length;
    }
  };
}


StaticHtml.prototype.appendResourcesHash = function(content, hash){

 if(!this.options.appendHash){
  return content;
}
 
 content = this.appendLinkedResourcesHash(content, hash);
 content = this.appendScriptedResourcesHash(content, hash);

 return content;
}

StaticHtml.prototype.appendLinkedResourcesHash = function(str, hash){

const links = str.match(/(<link.*?href=["|'].*?([^\"][\w\.\[\]+\?])+)["|'].*?\/>/g);

if(typeof(links)!=="object" || links === null){
  return str;
}

links.map(function(link){
     var pattern = /href=["|'](.*?)["|']/;
     var match = link.match(pattern);
 
     var resource = match[1]; 
     var hashedResource = appendHash(resource, hash);
 
     var elems = link.split(/\s+/);
     var hashedResource = appendHash(resource, hash);
     var resourceRel = findElem(elems, /^rel=/);
     var resourceMedia = findElem(elems, /^media=/);
     var resourceType = findElem(elems, /^type=/);
     var newLink = '<link '+resourceRel + resourceMedia + resourceType +'href="'+hashedResource+'"/>';

     str = str.replace(link, newLink);
 
 });

function findElem(elems, pattern) {
  
  var elem = elems.find(function(elem) {
     var match = (elem.match(pattern)); 
     if(match==null) return false; 
     return match[0];
    });
  

  elem = typeof(elem)==="undefined"?"":elem;
  elem = elem.indexOf('/>')>0?elem.substr(0, elem.indexOf('/')):elem;
  return elem + " ";
 
}

return str;
}

StaticHtml.prototype.appendScriptedResourcesHash = function(str, hash){

const scripts = str.match(/<script.*?src=["|'](.*?)["|'][^>]*>([\s\S]*?)<\/script>/gm);
if(typeof(scripts)!=="object" || scripts === null){
 return str;
}
scripts.map(function(script){
    var src = script.match(/src=["|'](.*?)["|']/);
    var hashedResource = appendHash(src[1], hash);
    var hashedScript = '<script src="'+hashedResource+'"></script>';

    str = str.replace(script, hashedScript);

})
 
return str;
                                   
}

StaticHtml.prototype.prependDoctypeHtml = function(content){

  return  this.options.prependDoctypeHtml ? "<!DOCTYPE html>\n" + content : content;

}

function appendHash(resource, hash)
{
   return resource.indexOf("?")>0?resource+'&'+hash:resource+'?'+hash;
}


module.exports = StaticHtml;
