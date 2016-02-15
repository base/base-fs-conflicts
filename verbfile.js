'use strict';

var util = require('util');
var isAffirmative = require('is-affirmative');
var isDirty = require('./lib/git');
var conflicts = require('./');

module.exports = function(verb) {
  var dest = 'vendor/yeoman-generator';
  var proceed;

  verb.task('git-status', function(cb) {
    proceed = false;

    isDirty(dest, function(err, dirty) {
      if (err) return cb(err);

      if (dirty) {
        var name = verb.pkg.get('name');
        var prop = name ? name : 'this project';

        verb.questions.set('proceed', {
          type: 'confirm',
          message: util.format('Looks like %s has uncommitted changes, are you sure you want to proceed?', prop),
          default: false
        });

        verb.ask('proceed', function(err, answers) {
          if (err) return cb(err);
          proceed = answers.proceed;
          cb();
        });
      } else {
        proceed = true;
        cb();
      }
    });
  });

  verb.task('conflicts', ['git-status'], function(cb) {
    if (!proceed) return cb();

    return verb.src('vendor/fixtures/*', {dot: true, cwd: __dirname})
      .on('error', console.error)
      .pipe(conflicts(verb, dest))
      .on('error', console.error)
      .pipe(verb.dest(dest));

  });

  verb.task('default', ['conflicts']);
};
