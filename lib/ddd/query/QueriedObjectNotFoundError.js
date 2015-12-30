'use strict';

var util = require('util');
var FunctionalError = require('../../tools/error/FunctionalError');

function QueriedObjectNotFoundError(criteria) {
  var message = 'Queried object not found for ' + JSON.stringify(criteria);
  FunctionalError.call(this, message);
}

util.inherits(QueriedObjectNotFoundError, FunctionalError);

module.exports = QueriedObjectNotFoundError;
