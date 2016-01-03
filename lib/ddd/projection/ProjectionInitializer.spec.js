'use strict';

require('chai').should();
var _ = require('lodash');
var sinon = require('sinon');
var path = require('path');
var ProjectionInitializer = require('./ProjectionInitializer');

describe('The projection initializer', function () {

  var eventBus;
  var database;
  var projections;

  beforeEach(function () {
    database = {the: 'db'};
    eventBus = {register: sinon.stub()};
    var rootDirectory = path.resolve(__dirname, '../../test/initializersTests/projections');
    var initializer = new ProjectionInitializer(database, {event: eventBus}, {rootDirectory: rootDirectory});
    return initializer.initialize().then(function (p) {
      projections = p;
    });
  });

  it('should find all event handlers and register them to the bus', function () {
    _.keys(projections).should.deep.equal(['firstUser', 'secondUser']);
    eventBus.register.should.have.callCount(3);
    eventBus.register.getCall(0).args[0].should.equal('userAddedEvent');
    eventBus.register.getCall(1).args[0].should.equal('userDeletedEvent');
    eventBus.register.getCall(2).args[0].should.equal('userAddedEvent');
  });

  it('should initialize a fully working projection', function () {
    projections.firstUser.providedDatabase.should.equal(database);
  });
});
