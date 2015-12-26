'use strict';

var WebError = require('./WebError');

function ServerError(message, code) {
  WebError.call(
    this,
    message || 'Server error',
    code || 500);
}

ServerError.prototype = WebError.prototype;

module.exports = ServerError;

