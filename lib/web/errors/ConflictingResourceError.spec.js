'use strict';

require('chai').should();
var ConflictingResourceError = require('./ConflictingResourceError');

describe('A conflicting resource error', function () {
  var error;

  beforeEach(function () {
    error = new ConflictingResourceError();
  });

  it('should have a default message', function () {
    error.message.should.equal('Conflicting resource');
  });

  it('could have a custom message', function () {
    var error = new ConflictingResourceError('Bleh');

    error.message.should.equal('Bleh');
  });

  it('should have 409 as default code', function () {
    error.code.should.equal(409);
  });
});
