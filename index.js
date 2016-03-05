'use strict';

var path = require('path');
var inquirer = require('inquirer2');
var utils = require('./lib/utils');
var diff = require('./lib/diffs');

/**
 * Detect potential conflicts between existing files and the path and
 * contents of a vinyl file. If the destination `file.path` already
 * exists on the file system:
 *
 *   1. The existing file's contents is compared with `file.contents` on the vinyl file
 *   2. If the contents of both are identical, no action is taken
 *   3. If the contents differ, the user is prompted for action
 *   4. If no conflicting file exists, the vinyl file is written to the file system
 *
 * ```js
 * app.src('foo/*.js')
 *   .pipe(app.conflicts('foo'))
 *   .pipe(app.dest('foo'));
 * ```
 * @param {String} `dest` The same desination directory passed to `app.dest()`
 * @return {String}
 * @api public
 */

module.exports = function(config) {
  return function(app) {
    var actions = {};
    var files = [];

    this.define('conflicts', function(dest, options) {
      if (typeof dest !== 'string') {
        throw new TypeError('expected dest to be a string');
      }

      if (!('cwd' in app)) {
        app.cwd = process.cwd();
      }

      var opts = utils.extend({}, config, this.options, options);
      detectConflicts(this, files, actions, opts);

      return utils.through.obj(function(file, enc, next) {
        if (file.isNull()) return next();

        // overwrite the current file
        if (opts.overwrite === true) {
          return next(null, file);
        }
        // abort
        if (actions.abort) {
          files = [];
          return next();
        }
        // overwrite all files
        if (actions.all === true) {
          files.push(file);
          return next();
        }

        file.path = path.resolve(path.resolve(app.cwd, dest), file.relative);
        app.detectConflicts(file, next);
      }, function(next) {
        files.forEach(this.push.bind(this));
        next();
      });
    });
  };
};

/**
 * Detect file conflicts and the user how to proceed.
 *
 * The following actions are supported:
 *
 *   - `Y` yes, overwrite this file (this is the default)
 *   - `n` no do not overwrite this file
 *   - `a` overwrite this file and all remaining files
 *   - `x` abort
 *   - `d` show the differences between the old and the new
 *   - `h` help. displays this help menu in the terminal
 *
 * @param {Object} `app` Base application instance
 * @param {Array} `files`
 * @param {Object} `actions`
 * @param {Object} `options`
 */

function detectConflicts(app, files, actions, options) {
  actionsListeners(app, files, actions);
  var questions = inquirer();

  app.define('detectConflicts', function(file, next) {
    var conflict = utils.detect(file.path, file.contents.toString());
    if (conflict) {
      questions.prompt(createQuestion(file), function(answers) {
        app.emit('action', answers.actions, file, next);
      });
    } else {
      files.push(file);
      next();
    }
  });
}

/**
 * Listen for action events, based on feedback provided by the user
 * after a conflict was identified.
 *
 * @param {Object} `app` instance of assemble, templates, verb, generator or any other templates-based application.
 * @param {Array} `files` Array of files to write
 * @param {Object} `actions` Object of actions to propagate
 */

function actionsListeners(app, files, actions) {
  app.on('action', function(type, file, next) {
    utils.log[type](file);
    app.emit('action.' + type, file, next);
  });

  app.on('action.yes', function(file, next) {
    files.push(file);
    next();
  });

  app.on('action.no', function(file, next) {
    next();
  });

  app.on('action.all', function(file, next) {
    actions.all = true;
    files.push(file);
    next();
  });

  app.on('action.abort', function(file, next) {
    actions.abort = true;
    next();
  });

  app.on('action.diff', function(file, next) {
    diff(file, function(err) {
      if (err) return next(err);
      app.detectConflicts(file, next);
    });
  });
}

/**
 * Create the question to ask when a conflict is detected
 *
 * @param {Object} `file` vinyl file
 * @return {Array} Question formatted the way inquirer expects it.
 */

function createQuestion(file) {
  return [{
    name: 'actions',
    type: 'expand',
    save: false,
    message: 'File exists, want to overwrite ' + utils.relative(file) + '?',
    choices: [{
      key: 'y',
      name: 'yes, overwrite this file',
      value: 'yes'
    }, {
      key: 'n',
      name: 'no, do not overwrite this file',
      value: 'no'
    }, {
      key: 'a',
      name: 'overwrite this file and all remaining files',
      value: 'all'
    }, {
      key: 'x',
      name: 'abort',
      value: 'abort'
    }, {
      key: 'd',
      name: 'show the differences between the existing and the new',
      value: 'diff'
    }]
  }];
}
