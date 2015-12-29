'use strict';

require('chai').should();
var TechnicalError = require('./TechnicalError');

describe('A technical error', function () {

  it('should have a generic error message by default', function () {
    var error = new TechnicalError();

    error.message.should.equal('Technical error');
  });
});
