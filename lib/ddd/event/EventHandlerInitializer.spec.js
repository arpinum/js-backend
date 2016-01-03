'use strict';

require('chai').should();
var sinon = require('sinon');
var path = require('path');
var EventHandlerInitializer = require('./EventHandlerInitializer');

describe('The event handler initializer', function () {

  var eventBus;

  beforeEach(function () {
    eventBus = {register: sinon.stub()};
    var rootDirectory = path.resolve(__dirname, '../../test/initializersTests/events');
    var initializer = new EventHandlerInitializer({event: eventBus}, {rootDirectory: rootDirectory});
    return initializer.initialize();
  });

  it('should find all event handlers and register them to the bus', function () {
    eventBus.register.should.have.callCount(3);
    eventBus.register.getCall(0).args[0].should.equal('userAddedEvent');
    eventBus.register.getCall(1).args[0].should.equal('userDeletedEvent');
    eventBus.register.getCall(2).args[0].should.equal('userAddedEvent');
  });
});
