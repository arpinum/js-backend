'use strict';

require('chai').should();
var sinon = require('sinon');
var path = require('path');
var SagaHandlerInitializer = require('./SagaHandlerInitializer');

describe('The saga handler initializer', () => {

  var eventBus;

  beforeEach(() => {
    eventBus = {register: sinon.stub(), broadcast: sinon.stub()};
    var rootDirectory = path.resolve(__dirname, '../../test/initializersTests/sagas');
    var initializer = new SagaHandlerInitializer({event: eventBus}, {rootDirectory: rootDirectory});
    return initializer.initialize();
  });

  it('should find all saga handlers and register them to the bus', () => {
    eventBus.register.should.have.callCount(3);
    eventBus.register.getCall(0).args[0].should.equal('userAddedEvent');
    eventBus.register.getCall(1).args[0].should.equal('userDeletedEvent');
    eventBus.register.getCall(2).args[0].should.equal('userAddedEvent');
  });

  it('should initialize a fully working handler', () => {
    var event = {id: '1', type: 'anotherEvent'};
    let userAddedHandler = eventBus.register.getCall(0).args[1];

    userAddedHandler(event);

    eventBus.broadcast.should.have.been.calledWith(event);
  });
});
