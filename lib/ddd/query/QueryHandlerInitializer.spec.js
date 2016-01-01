'use strict';

require('chai').should();
var sinon = require('sinon');
var path = require('path');
var QueryHandlerInitializer = require('./QueryHandlerInitializer');
var MemoryQueryProcessor = require('../../test/MemoryQueryProcessor');

describe('The query handler initializer', function () {

  var queryProcessor;
  var queryBus;

  beforeEach(function () {
    queryProcessor = new MemoryQueryProcessor();
    queryBus = {register: sinon.stub()};
    var rootDirectory = path.resolve(__dirname, '../../test/initializersTests/queries');
    var initializer = new QueryHandlerInitializer(queryProcessor, queryBus, {rootDirectory: rootDirectory});
    return initializer.initialize();
  });

  it('should find all query handler and register them to the bus', function () {
    queryBus.register.should.have.been.calledTwice;
    queryBus.register.should.have.been.calledWith('userQuery');
    queryBus.register.should.have.been.calledWith('veryLastQuery');
  });

  it('should initialize a fully working handler', function () {
    var query = {id: '2'};
    queryProcessor.collections.users = [{id: '1', email: 'email'}, {id: '2', email: 'email'}];

    return handler()(query).should.eventually.deep.equal({id: '2', email: 'email'});
  });

  function handler() {
    return queryBus.register.firstCall.args[1];
  }
});
