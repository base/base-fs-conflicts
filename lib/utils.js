'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line

/**
 * Lazily required module dependencies
 */

require('ansi-colors', 'colors');
require('array-pull', 'pull');
require('async');
require('bytes');
require('cli-table', 'Table');
require('dateformat-light', 'dateFormat');
require('detect-conflict', 'detect');
require('diff');
require('extend-shallow', 'extend');
require('gitty');
require('istextorbinary', 'itob');
require('read-chunk');
require('through2', 'through');
require('try-open', 'exists');
require = fn; // eslint-disable-line

/**
 * Utils
 */

var symbols = {};
symbols.success = require('success-symbol');
symbols.warning = require('warning-symbol');
symbols.error = require('error-symbol');
symbols.info = require('info-symbol');
utils.symbols = symbols;

utils.relative = function relative(file) {
  return utils.colors.yellow(path.relative(process.cwd(), file.path));
};

var info = utils.colors.cyan(utils.symbols.info);
var success = utils.colors.green(utils.symbols.success);
var warning = utils.colors.yellow(utils.symbols.warning);
var error = utils.colors.red(utils.symbols.error);

utils.log = {
  yes: function(file) {
    console.log('%s overwriting %s', success, utils.relative(file));
  },
  identical: function(file) {},
  no: function(file) {
    console.log('%s skipping %s', warning, utils.relative(file));
  },
  all: function(file) {
    console.log('%s all remaining files will be written, and will overwrite any existing files.', success);
  },
  abort: function(file) {
    console.log('%s stopping, no files will be written', error);
  },
  diff: function(file) {
    console.log('%s diff comparison of %s and existing content', info, utils.relative(file));
  }
};

/**
 * Expose `utils`
 */

module.exports = utils;
