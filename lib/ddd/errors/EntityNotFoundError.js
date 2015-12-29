'use strict';

var util = require('util');
var FunctionalError = require('../../tools/errors/FunctionalError');

function EntityNotFoundError(criteria) {
  var message = 'No entity for ' + JSON.stringify(criteria);
  FunctionalError.call(this, message);
}

util.inherits(EntityNotFoundError, FunctionalError);

module.exports = EntityNotFoundError;
