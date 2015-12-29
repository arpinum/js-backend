'use strict';

var util = require('util');
var FunctionalError = require('../../tools/errors/FunctionalError');

function ConflictingEntityError(message) {
  FunctionalError.call(this, message);
}

util.inherits(ConflictingEntityError, FunctionalError);

module.exports = ConflictingEntityError;
