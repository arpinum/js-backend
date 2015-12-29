'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var FunctionalError = require('../../tools/error/FunctionalError');
var EntityNotFoundError = require('../../ddd/error/EntityNotFoundError');
var ConflictingEntityError = require('../../ddd/error/ConflictingEntityError');
var ClientError = require('../error/ClientError');
var ServerError = require('../error/ServerError');
var WebError = require('../error/WebError');
var ResourceNotFoundError = require('../error/ResourceNotFoundError');
var ConflictingResourceError = require('../error/ConflictingResourceError');
var LoggerFactory = require('../../tools/LoggerFactory');

function UnhandledErrorMiddleware(options) {
  var $options = parseOptions(options);
  this.configure = configure;

  function configure(application) {
    /*eslint no-unused-vars: 0*/
    application.use(function (error, request, response, next) {
      logError(error);
      var webError = webErrorFrom(error);
      response
        .status(webError.code)
        .send({error: webError.message});
    });
  }

  function logError(error) {
    $options.log.error(_s.sprintf('Unhandled error (%s)', error.stack || error.message));
  }

  function webErrorFrom(error) {
    if (isA(error, EntityNotFoundError)) {
      return new ResourceNotFoundError(error.message);
    }
    if (isA(error, ConflictingEntityError)) {
      return new ConflictingResourceError(error.message);
    }
    if (isA(error, WebError)) {
      return error;
    }
    if (isA(error, FunctionalError)) {
      return new ClientError(error.message);
    }
    return serverErrorFrom(error);
  }

  function serverErrorFrom(error) {
    var message = $options.verboseWebErrors ? error.message : null;
    return new ServerError(message);
  }

  function isA(error, constructor) {
    return error instanceof constructor;
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename),
      verboseWebErrors: false
    });
  }
}

module.exports = UnhandledErrorMiddleware;
