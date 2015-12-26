'use strict';

var util = require('util');

function TechnicalError(message) {
  Error.call(this);
  this.message = message || 'Technical error';
}

util.inherits(TechnicalError, Error);

module.exports = TechnicalError;
