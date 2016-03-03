'use strict';

var QueriedObjectNotFoundError = require('./QueriedObjectNotFoundError');

describe('The queried object not found error', function () {

  it('should be created with a message based on criteria', function () {
    var error = new QueriedObjectNotFoundError({a: 'criterion'});

    error.message.should.equal('Queried object not found for {"a":"criterion"}');
  });
});
