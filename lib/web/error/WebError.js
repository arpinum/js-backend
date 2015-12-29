'use strict';

var util = require('util');

function WebError(message, code) {
  var self = this;
  Error.call(self);
  self.message = message;
  self.code = code;
}

util.inherits(WebError, Error);

module.exports = WebError;
