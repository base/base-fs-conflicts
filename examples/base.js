'use strict';

var path = require('path');
var Base = require('base');
var vfs = require('base-fs');
var option = require('base-option');
var conflicts = require('..');

var base = new Base({isApp: true});
base.use(option());
base.use(conflicts());
base.use(vfs());

base.option('overwrite', function(file) {
  return file.basename === 'b.txt';
});

var cwd = path.resolve.bind(path, __dirname, '../test/fixtures');
var dest = cwd('dist');

base.src('*.txt', {dot: true, cwd: cwd()})
  .pipe(base.conflicts(dest))
  .pipe(base.dest(dest));
