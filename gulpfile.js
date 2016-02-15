'use strict';

var gulp = require('gulp');
var conflicts = require('./conflicts');

gulp.task('conflicts', function(cb) {
  gulp.src('vendor/fixtures/*')
    .pipe(conflicts())
    .pipe(gulp.dest('vendor/yeoman-generator'))
    .on('end', cb);
});

gulp.task('default', ['conflicts']);
