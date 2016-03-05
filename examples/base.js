'use strict';

var path = require('path');
var Base = require('base');
var fs = require('base-fs');
var conflicts = require('..');

var base = new Base();
base.use(conflicts());
base.use(fs());

var cwd = path.resolve.bind(path, __dirname, '../test/fixtures');
var dest = cwd('dist');

base.src('*.txt', {dot: true, cwd: cwd()})
  .pipe(base.conflicts(dest))
  .pipe(base.dest(dest));
