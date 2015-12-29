'use strict';

var ClientError = require('./ClientError');

function UnauthorizedError(message) {
  ClientError.call(
    this,
    message || 'Unauthorized',
    401);
}

UnauthorizedError.prototype = ClientError.prototype;

module.exports = UnauthorizedError;
