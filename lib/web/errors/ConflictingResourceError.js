'use strict';

var ClientError = require('./ClientError');

function ConflictingResourceError(message) {
  ClientError.call(
    this,
    message || 'Conflicting resource',
    409);
}

ConflictingResourceError.prototype = ClientError.prototype;

module.exports = ConflictingResourceError;
