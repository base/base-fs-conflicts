'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

module.exports = function isDirty(cwd, cb) {
  var fp = path.resolve(cwd, '.git');
  var repo = utils.gitty(cwd);

  fs.open(fp, 'r', function(err, fd) {
    if (err) return cb(null, false);

    repo.status(function(err, status) {
      if (err) return cb(err);
      if (hasFiles(status)) {
        cb(null, status);
      } else {
        cb();
      }
    });
  });
};

function hasFiles(status) {
  var types = ['staged', 'unstaged', 'untracked'];
  var len = types.length;
  var idx = -1;

  while (++idx < len) {
    var type = types[idx];
    if (status[type].length) {
      return true;
    }
  }
  return false;
}

// isDirty(process.cwd(), function(err, dirty) {
//   console.log(dirty)
// });
