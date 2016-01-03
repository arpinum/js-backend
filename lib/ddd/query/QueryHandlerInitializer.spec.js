'use strict';

require('chai').should();
var Bluebird = require('bluebird');
var sinon = require('sinon');
var path = require('path');
var QueryHandlerInitializer = require('./QueryHandlerInitializer');

describe('The query handler initializer', function () {

  var queryBus;
  var userProjection;

  beforeEach(function () {
    queryBus = {register: sinon.stub()};
    userProjection = {findFirst: sinon.stub().returns(Bluebird.resolve())};
    var rootDirectory = path.resolve(__dirname, '../../test/initializersTests/queries');
    var initializer = new QueryHandlerInitializer(
      {user: userProjection},
      {query: queryBus},
      {rootDirectory: rootDirectory});
    return initializer.initialize();
  });

  it('should find all query handler and register them to the bus', function () {
    queryBus.register.should.have.been.calledTwice;
    queryBus.register.should.have.been.calledWith('userQuery');
    queryBus.register.should.have.been.calledWith('veryLastQuery');
  });

  it('should initialize a fully working handler', function () {
    var query = {id: '1'};
    userProjection.findFirst
      .withArgs(query)
      .returns(Bluebird.resolve({id: '1', email: 'email'}));

    return handler()(query).should.eventually.deep.equal({id: '1', email: 'email'});
  });

  function handler() {
    return queryBus.register.firstCall.args[1];
  }
});
