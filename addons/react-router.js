const util = require('util');

module.exports = {
  getPaths: function(routes){

      let path = routes.props.path;
      let paths = [path];
      parseReactRoutesPathes(routes, paths, path);
      return paths;
  }
}

function parseReactRoutesPathes(routes, paths, parentPath){

  let currentParentPath = parentPath;

  if(typeof(routes.props.children) === "function"){
    return;
  }


  if(util.isObject(routes.props.children)){
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
      }

      paths.push(childPath);
      parentPath = childPath;

      parseReactRoutesPathes(child, paths, parentPath);
    })
  }
}
