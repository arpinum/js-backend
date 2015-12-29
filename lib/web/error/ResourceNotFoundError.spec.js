'use strict';

require('chai').should();
var ResourceNotFoundError = require('./ResourceNotFoundError');

describe('A resource not found error', function () {
  var error;

  beforeEach(function () {
    error = new ResourceNotFoundError();
  });

  it('should have a default message', function () {
    error.message.should.equal('Resource not found');
  });

  it('could have a custom message', function () {
    var error = new ResourceNotFoundError('Bleh');

    error.message.should.equal('Bleh');
  });

  it('should have 404 as default code', function () {
    error.code.should.equal(404);
  });
});
