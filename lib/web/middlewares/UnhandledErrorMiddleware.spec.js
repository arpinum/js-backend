'use strict';

require('chai').should();
var FakeApplication = require('../../test/FakeApplication');
var FakeResponse = require('../../test/FakeResponse');
var UnhandledErrorMiddleware = require('./UnhandledErrorMiddleware');
var TechnicalError = require('../../tools/errors/TechnicalError');
var FunctionalError = require('../../tools/errors/FunctionalError');
var ClientError = require('../errors/ClientError');
var ConflictingEntityError = require('../../ddd/errors/ConflictingEntityError');
var EntityNotFoundError = require('../../ddd/errors/EntityNotFoundError');

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
    response.send.should.have.been.calledWith({error: 'the error'});
  });

  it('should hide the detailed message based on configuration', function () {
    var error = new TechnicalError('very technical message');
    var application = createApplicationWithMiddleware({verboseWebErrors: false});

    application.middlewares[0](error, null, response);

    response.send.should.have.been.calledWith({error: 'Server error'});
  });

  it('should send a client error for functionnal errors', function () {
    var error = new FunctionalError('badaboom');

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(400);
    response.send.should.have.been.calledWith({error: 'badaboom'});
  });

  it('should send a 404 for an entity not found error', function () {
    var error = new EntityNotFoundError({id: '33'});

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(404);
    var message = 'No entity for ' + JSON.stringify({id: '33'});
    response.send.should.have.been.calledWith({error: message});
  });

  it('should send a 409 for a conflicting entity error', function () {
    var error = new ConflictingEntityError();

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(409);
    response.send.should.have.been.calledWith({error: error.message});
  });

  it('should send the provided error code if present', function () {
    var error = new ClientError('not found', 404);

    application.middlewares[0](error, null, response);

    response.status.should.have.been.calledWith(404);
    response.send.should.have.been.calledWith({error: 'not found'});
  });

  function createApplicationWithMiddleware(options) {
    var application = new FakeApplication();
    var middleware = new UnhandledErrorMiddleware(options);
    middleware.configure(application);
    return application;
  }
});
