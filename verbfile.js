'use strict';

var path = require('path');
var cwd = path.join.bind(path, __dirname, 'test/fixtures');
var conflicts = require('./');

/**
 * Example usage with verb
 *
 * ```sh
 * $ verb conflicts
 * ```
 */

module.exports = function(verb) {
  verb.use(require('verb-readme-generator'));
  verb.use(conflicts());

  verb.task('conflicts', function() {
    return verb.src(cwd('*.txt'))
      .pipe(verb.conflicts(cwd('dist')))
      .pipe(verb.dest(cwd('dist')));
  });

  verb.task('default', ['readme']);
};
