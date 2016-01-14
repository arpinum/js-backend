'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var inspector = require('schema-inspector');
var ClientError = require('../error/ClientError');

function BodyValidator() {
  this.promiseIfBodyIsValid = promiseIfBodyIsValid;

  function promiseIfBodyIsValid(validation) {
    inspector.sanitize(validation.schema, validation.request.body);
    var validationResult = inspector.validate(validation.schema, validation.request.body);
    if (!validationResult.valid) {
      var reject = new ClientError(formatErrorMessage(validation, validationResult.error));
      return Bluebird.reject(reject);
    }
    return validation.promise(validation.request, validation.response);
  }

  function formatErrorMessage(validation, errors) {
    var messages = _.pluck(errors, 'message');
    return `${validation.errorMessage}: ${messages.join(', ')}`;
  }
}

module.exports = BodyValidator;
