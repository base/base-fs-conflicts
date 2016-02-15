'use strict';

var fs = require('fs');
var diff = require('./diff');
var utils = require('./utils');

module.exports = function(file, next) {
  if (isBinary(file.path, file.contents)) {
    console.log(binaryDiff(file.path, file.contents));
  } else {
    diff(fs.readFileSync(file.path, 'utf8'), file.contents.toString());
  }
  next();
};

function isBinary(existingPath, newFileContents) {
  var header = utils.readChunk.sync(existingPath, 0, 512);
  return utils.itob.isBinarySync(undefined, header)
    || utils.itob.isBinarySync(undefined, newFileContents);
}

function binaryDiff(existingPath, newFileContents) {
  var existingStat = fs.statSync(existingPath);
  var sizeDiff;

  var table = new utils.Table({
    head: ['', 'Existing', 'Replacement', 'Diff']
  });

  if (existingStat.size > newFileContents.length) {
    sizeDiff = '-';
  } else {
    sizeDiff = '+';
  }

  sizeDiff += utils.bytes(Math.abs(existingStat.size - newFileContents.length));

  table.push([
    'Size',
    utils.bytes(existingStat.size),
    utils.bytes(newFileContents.length),
    sizeDiff
  ], [
    'Last modified',
    utils.dateFormat(existingStat.mtime),
    '',
    ''
  ]);

  return table.toString();
};
