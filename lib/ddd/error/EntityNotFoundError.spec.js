'use strict';

require('chai').should();
var EntityNotFoundError = require('./EntityNotFoundError');

describe('The entity not found error', function () {

  it('should be created with a message based on criteria', function () {
    var error = new EntityNotFoundError({a: 'criterion'});

    error.message.should.equal('No entity for {"a":"criterion"}');
  });
});
