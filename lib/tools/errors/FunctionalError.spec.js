'use strict';

require('chai').should();
var FunctionalError = require('./FunctionalError');

describe('A functionnal error', function () {

  it('should have a generic error message by default', function () {
    var error = new FunctionalError();

    error.message.should.equal('Functionnal error');
  });
});
