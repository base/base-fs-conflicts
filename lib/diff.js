'use strict';

var utils = require('./utils');

function green(msg) {
  return utils.colors.black(utils.colors.bggreen(msg));
}

/**
 * Shows a color-based diff of two strings
 *
 * @param {string} actual
 * @param {string} expected
 */

module.exports = function(actual, expected) {
  var colors = {added: green, removed: utils.colors.bgred};
  var str = utils.diff.diffLines(actual, expected).map(function(str) {
    if (str.added) {
      return colorLines(colors, 'added', str.value);
    }
    if (str.removed) {
      return colorLines(colors, 'removed', str.value);
    }
    return str.value;
  }).join('');

  // legend
  var msg = '\n';
  msg += colors.removed('removed') + ' ';
  msg += colors.added('added');
  msg += '\n\n' + str + '\n';
  console.log(msg);
  return msg;
};

function colorLines(colors, name, str) {
  return str.split('\n').map(function(str) {
    return colors[name](str);
  }).join('\n');
}
