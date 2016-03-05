'use strict';

var path = require('path');
var conflicts = require('./');
var cwd = path.join.bind(path, __dirname, 'test/fixtures');

/**
 * Example usage
 */

module.exports = function(verb) {
  verb.use(conflicts());

  verb.task('default', function() {
    return verb.src(cwd('*.txt'))
      .pipe(verb.conflicts(cwd('dist')))
      .pipe(verb.dest(cwd('dist')));
  });
};
