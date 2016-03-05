'use strict';

var fs = require('fs');
var diff = require('./diff');
var utils = require('./utils');

module.exports = function(file, next) {
  var buf = file.contents;
  if (isBinary(file.path, buf)) {
    console.log(binaryDiff(file.path, buf));
  } else {
    var str = fs.readFileSync(file.path, 'utf8');
    console.log(diff(str, buf.toString()));
  }
  next();
};

function isBinary(existingPath, fileContents) {
  var header = utils.readChunk.sync(existingPath, 0, 512);
  return utils.itob.isBinarySync(undefined, header)
    || utils.itob.isBinarySync(undefined, fileContents);
}

function binaryDiff(existingPath, fileContents) {
  var existingStat = fs.statSync(existingPath);
  var sizeDiff;

  var table = new utils.Table({
    head: ['', 'Existing', 'Replacement', 'Diff']
  });

  if (existingStat.size > fileContents.length) {
    sizeDiff = '-';
  } else {
    sizeDiff = '+';
  }

  sizeDiff += utils.bytes(Math.abs(existingStat.size - fileContents.length));

  table.push([
    'Size',
    utils.bytes(existingStat.size),
    utils.bytes(fileContents.length),
    sizeDiff
  ], [
    'Last modified',
    utils.dateFormat(existingStat.mtime),
    '',
    ''
  ]);

  return table.toString();
};
