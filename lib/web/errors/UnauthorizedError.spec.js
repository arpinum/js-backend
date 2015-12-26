'use strict';

require('chai').should();
var UnauthorizedError = require('./UnauthorizedError');

describe('An unauthorized error', function () {
  var error;

  beforeEach(function () {
    error = new UnauthorizedError();
  });

  it('should have a default message', function () {
    error.message.should.equal('Unauthorized');
  });

  it('could have a custom message', function () {
    var error = new UnauthorizedError('Bleh');

    error.message.should.equal('Bleh');
  });

  it('should have 401 as default code', function () {
    error.code.should.equal(401);
  });
});
