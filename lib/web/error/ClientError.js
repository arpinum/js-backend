'use strict';

var WebError = require('./WebError');

function ClientError(message, code) {
  WebError.call(
    this,
    message || 'Client error',
    code || 400);
}

ClientError.prototype = WebError.prototype;

module.exports = ClientError;

