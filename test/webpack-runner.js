import MemoryFS from 'memory-fs';
import webpack from 'webpack';

module.exports = function(config, check, done){

  let fs = new MemoryFS();
  let compiler = webpack(config);
  compiler.outputFileSystem = fs;

  compiler.run(function(err, stats){

     if(err)
        return done(err);
     var jsonStats = stats.toJson();
     if(jsonStats.errors.length > 0)
          return done(jsonStats.errors);
     if(jsonStats.warnings.length > 0)
         done(jsonStats.warnings);

     check(fs)
     done();

  })
}
