'use strict';

var util = require('util');

function FunctionalError(message) {
  Error.call(this);
  this.message = message || 'Functionnal error';
}

util.inherits(FunctionalError, Error);

module.exports = FunctionalError;
