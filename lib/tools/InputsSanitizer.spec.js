'use strict';

let FunctionnalError = require('./error/FunctionalError');
let InputsSanitizer = require('./InputsSanitizer');

describe('The inputs sanitizer', () => {

  let sanitizer;
  let schema;

  beforeEach(() => {
    sanitizer = new InputsSanitizer();
    schema = {
      type: 'object',
      properties: {
        great: {type: 'boolean', error: 'great is mandatory'}
      }
    };
  });

  it('should succeed if inputs are valid', () => {
    let object = {great: 'true'};

    sanitizer.sanitize(schema, object);

    object.should.deep.equal({great: true});
  });

  it('should failed if inputs is invalid', () => {
    let object = {};

    let sanitize = () => {
      sanitizer.sanitize(schema, object);
    };

    sanitize.should.throw(FunctionnalError, 'Input validation failed: great is mandatory');
  });

  it('could failed with custom error message', () => {
    let object = {};

    let sanitize = () => {
      sanitizer.sanitize(schema, object, {errorMessage: 'Failure'});
    };

    sanitize.should.throw(FunctionnalError, 'Failure: great is mandatory');
  });
});
