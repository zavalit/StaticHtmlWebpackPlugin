"use strict";

const util = require('util');

module.exports = {
  getPaths: function(routes){

      let paths = [];
      if(util.isArray(routes)){ // Array format

	         parseArrayReactRoutesPathes(routes, paths)


      }else if(util.isObject(routes)){ // JSX format

        let path = routes.props.path;
        paths = [path];
        parseObjectReactRoutesPathes(routes, paths, path);

      }

      return paths;
  }
}

function parseArrayReactRoutesPathes(routes, paths, parentPath)
{
    routes.map(function(route){

      let path = route.path;

      if(path.indexOf('/')!==0 && util.isString(parentPath) && parentPath !=="/"){ // if it relative
        path = parentPath + "/" + path;
      } else if (path.indexOf('/')!==0 && parentPath ==="/"){
        path = parentPath + path;
      }

      paths.push(path);

      if(util.isArray(route.childRoutes)){
        parseArrayReactRoutesPathes(route.childRoutes, paths, path)
      }
  })
}

function parseObjectReactRoutesPathes(routes, paths, parentPath){

  let currentParentPath = parentPath;

  if(typeof(routes.props.children) === "function"){
    return;
  }


  if(util.isObject(routes.props.children) && !util.isArray(routes.props.children)){
      let childPath = routes.props.children.props.path;

      if(childPath.indexOf('/')!==0 && currentParentPath !=="/"){ // if it relative
        childPath = currentParentPath + "/" + childPath;
      }else{
        childPath = currentParentPath +  childPath;
      }

      paths.push(childPath);

  }else if(util.isArray(routes.props.children)){

    routes.props.children.forEach(function(child){

      if(typeof(child.props.path) !== "string"){
        return;
      }

      let childPath = child.props.path;


      if(childPath.indexOf('/')!==0 && currentParentPath !=="/"){ // if it relative
        childPath = currentParentPath + "/" + childPath;
      } else if (childPath.indexOf('/')!==0 && currentParentPath ==="/"){
        childPath = currentParentPath + childPath;
      }

      paths.push(childPath);
      parentPath = childPath;

      parseObjectReactRoutesPathes(child, paths, parentPath);
    })
  }
}
