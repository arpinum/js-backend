'use strict';

var _ = require('lodash');
var FunctionalError = require('../../tools/error/FunctionalError');
var QueriedObjectNotFoundError = require('../../ddd/query/QueriedObjectNotFoundError');
var EntityNotFoundError = require('../../ddd/error/EntityNotFoundError');
var ClientError = require('../error/ClientError');
var ServerError = require('../error/ServerError');
var WebError = require('../error/WebError');
var ResourceNotFoundError = require('../error/ResourceNotFoundError');
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
        .send({error: webError});
    });
  }

  function logError(error) {
    var message = error.stack || error.message;
    $options.log.error(`Unhandled error (${message})`);
  }

  function webErrorFrom(error) {
    if (isA(error, EntityNotFoundError) || isA(error, QueriedObjectNotFoundError)) {
      return translateError(error, ResourceNotFoundError);
    }
    if (isA(error, WebError)) {
      return error;
    }
    if (isA(error, FunctionalError)) {
      return translateError(error, ClientError);
    }
    return serverErrorFrom(error);
  }

  function serverErrorFrom(error) {
    var baseError = $options.verboseWebErrors ? error : {};
    return translateError(baseError, ServerError);
  }

  function translateError(sourceError, DestinationType) {
    var result = new DestinationType(sourceError.message);
    return _.defaults(result, sourceError);
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
