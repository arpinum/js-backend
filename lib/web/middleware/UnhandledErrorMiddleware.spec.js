'use strict';

require('chai').should();
var FakeApplication = require('../../test/FakeApplication');
var FakeResponse = require('../../test/FakeResponse');
var UnhandledErrorMiddleware = require('./UnhandledErrorMiddleware');
var TechnicalError = require('../../tools/error/TechnicalError');
var FunctionalError = require('../../tools/error/FunctionalError');
var ClientError = require('../error/ClientError');
var EntityNotFoundError = require('../../ddd/error/EntityNotFoundError');
var QueriedObjectNotFoundError = require('../../ddd/query/QueriedObjectNotFoundError');

describe('The unhandled error middleware', function () {
  var application;
  var response;

  beforeEach(function () {
    application = createApplicationWithMiddleware();
    response = new FakeResponse();
  });

  it('configure the application with a middleware', function () {
    application.middlewares.should.have.lengthOf(1);
  });

  it('should send a server error by default', function () {
    var error = new Error('the error');
    var application = createApplicationWithMiddleware({verboseWebErrors: true});

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(500);
    response.send.should.have.been.calledWith({
      error: {
        message: 'the error',
        code: 500
      }
    });
  });

  it('should hide the detailed message based on configuration', function () {
    var error = new TechnicalError('very technical message');
    error.uselessDetails = 'very useless for user';
    var application = createApplicationWithMiddleware({verboseWebErrors: false});

    application.middlewares[0](error, null, response);

    response.send.should.have.been.calledWith({
      error: {
        message: 'Server error',
        code: 500
      }
    });
  });

  it('should send a client error for functionnal errors', function () {
    var error = new FunctionalError('badaboom');

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(400);
    response.send.should.have.been.calledWith({
      error: {
        message: 'badaboom',
        code: 400
      }
    });
  });

  it('should preserve data stored in errors', function () {
    var error = new FunctionalError('badaboom');
    error.data = {the: 'data'};
    error.info = 3;

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(400);
    response.send.should.have.been.calledWith({
      error: {
        message: 'badaboom',
        data: {the: 'data'},
        info: 3,
        code: 400
      }
    });
  });

  it('should send a 404 for an entity not found error', function () {
    var error = new EntityNotFoundError({id: '33'});

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(404);
    var message = 'No entity for ' + JSON.stringify({id: '33'});
    response.send.should.have.been.calledWith({
      error: {message: message, code: 404}
    });
  });

  it('should send a 404 for a queried object not found error', function () {
    var error = new QueriedObjectNotFoundError({id: '33'});

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(404);
    var message = 'Queried object not found for ' + JSON.stringify({id: '33'});
    response.send.should.have.been.calledWith({
      error: {
        message: message,
        code: 404
      }
    });
  });

  it('should send the provided error code if present', function () {
    var error = new ClientError('not found', 404);

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(404);
    response.send.should.have.been.calledWith({
      error: {
        message: 'not found',
        code: 404
      }
    });
  });

  function createApplicationWithMiddleware(options) {
    var application = new FakeApplication();
    var middleware = new UnhandledErrorMiddleware(options);
    middleware.configure(application);
    return application;
  }
});
