'use strict';

require('chai').should();
var sinon = require('sinon');
var path = require('path');
var EventHandlerInitializer = require('./EventHandlerInitializer');

describe('The event handler initializer', () => {

  var eventBus;

  beforeEach(() => {
    eventBus = {register: sinon.stub(), broadcast: sinon.stub()};
    var rootDirectory = path.resolve(__dirname, '../../test/initializersTests/events');
    var initializer = new EventHandlerInitializer({event: eventBus}, {rootDirectory: rootDirectory});
    return initializer.initialize();
  });

  it('should find all event handlers and register them to the bus', () => {
    eventBus.register.should.have.callCount(4);
    eventBus.register.getCall(0).args[0].should.equal('userAddedEvent');
    eventBus.register.getCall(1).args[0].should.equal('userDeletedEvent');
    eventBus.register.getCall(2).args[0].should.equal('userAddedEvent');
    eventBus.register.getCall(3).args[0].should.equal('userUpdatedEvent');
  });

  it('should initialize a fully working multi handler', () => {
    var event = {id: '1', type: 'anotherEvent'};
    let userAddedHandler = eventBus.register.getCall(0).args[1];

    userAddedHandler(event);

    eventBus.broadcast.should.have.been.calledWith(event);
  });

  it('should initialize a fully working single handler', () => {
    var event = {id: '1', type: 'anotherEvent'};
    let userUpdatedHandler = eventBus.register.getCall(3).args[1];

    userUpdatedHandler(event);

    eventBus.broadcast.should.have.been.calledWith(event);
  });
});
