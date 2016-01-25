'use strict';

let _ = require('lodash');
let inspector = require('schema-inspector');
let FunctionalError = require('./error/FunctionalError');

class InputsSanitizer {
  sanitize(schema, object, options) {
    var $options = parseOptions(options);

    inspector.sanitize(schema, object);

    let validationResult = inspector.validate(schema, object);
    if (!validationResult.valid) {
      throw new FunctionalError(formatErrorMessage(validationResult.error));
    }

    function formatErrorMessage(errors) {
      let messages = _.pluck(errors, 'message');
      return `${$options.errorMessage}: ${messages.join(', ')}`;
    }

    function parseOptions(options) {
      return _.defaults(options || {}, {
        errorMessage: 'Input validation failed'
      });
    }
  }
}

module.exports = InputsSanitizer;
