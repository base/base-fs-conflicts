'use strict';

require('mocha');
var assert = require('assert');
var conflicts = require('..');
var Base = require('base');

describe('base-fs-conflicts', function() {
  it('should export a function', function() {
    assert.equal(typeof conflicts, 'function');
  });

  it('should add a conflicts method to app', function() {
    var app = new Base();
    app.use(conflicts());
    
    assert(app.conflicts);
    assert.equal(typeof app.conflicts, 'function');
  });
});
