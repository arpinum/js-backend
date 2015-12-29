'use strict';

var ClientError = require('./ClientError');

function ResourceNotFoundError(message) {
  ClientError.call(
    this,
    message || 'Resource not found',
    404);
}

ResourceNotFoundError.prototype = ClientError.prototype;

module.exports = ResourceNotFoundError;
