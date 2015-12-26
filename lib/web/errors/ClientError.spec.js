'use strict';

require('chai').should();
var ClientError = require('./ClientError');

describe('A client error', function () {

  it('could be created with a specific code and message', function () {
    var error = new ClientError('my message', 403);

    error.message.should.equal('my message');
    error.code.should.equal(403);
  });

  it('should have a generic message by default', function () {
    var error = new ClientError();

    error.message.should.equal('Client error');
  });

  it('should have a 400 as default code', function () {
    var error = new ClientError('my message');

    error.code.should.equal(400);
  });
});
