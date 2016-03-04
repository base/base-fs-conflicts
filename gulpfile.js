'use strict';

var gulp = require('gulp');
var conflicts = require('./conflicts');

gulp.task('conflicts', function(cb) {
  var dest = 'vendor/yeoman-generator';
  gulp.src('vendor/fixtures/*')
    .pipe(conflicts(dest))
    .pipe(gulp.dest(dest))
    .on('end', cb);
});
