'use strict';

require('chai').should();
var ConflictingEntityError = require('./ConflictingEntityError');

describe('The conflicting entity error', function () {

  it('could be created with a message', function () {
    var error = new ConflictingEntityError('a message');

    error.message.should.equal('a message');
  });
});
