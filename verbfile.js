'use strict';

var conflicts = require('./');

/**
 * Example usage
 */

module.exports = function(verb) {
  verb.use(conflicts());

  verb.task('default', function() {
    var dest = 'vendor/yeoman-generator';
    return verb.src('vendor/fixtures/*', { dot: true, cwd: __dirname })
      .on('error', console.error)
      .pipe(verb.conflicts(dest))
      .on('error', console.error)
      .pipe(verb.dest(dest));
  });
};
