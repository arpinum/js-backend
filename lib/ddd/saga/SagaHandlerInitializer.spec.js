'use strict';

require('chai').should();
let sinon = require('sinon');
let path = require('path');
var FakeRepository = require('../../test/FakeRepository');
var repositoryInMemory = require('../../test/repositoryInMemory');
let SagaHandlerInitializer = require('./SagaHandlerInitializer');

describe('The saga handler initializer', () => {

  let eventBus;
  let repositories;

  beforeEach(() => {
    repositories = {userForSaga: repositoryInMemory(FakeRepository)};
    eventBus = {register: sinon.stub(), broadcast: sinon.stub()};
    let rootDirectory = path.resolve(__dirname, '../../test/initializersTests/sagas');
    let initializer = new SagaHandlerInitializer(repositories, {event: eventBus}, {rootDirectory: rootDirectory});
    return initializer.initialize();
  });

  it('should find all saga handlers and register them to the bus', () => {
    eventBus.register.should.have.callCount(3);
    eventBus.register.getCall(0).args[0].should.equal('userAddedEvent');
    eventBus.register.getCall(1).args[0].should.equal('userDeletedEvent');
    eventBus.register.getCall(2).args[0].should.equal('userAddedEvent');
  });

  it('should initialize a fully working handler', () => {
    let event = {id: '1', type: 'anotherEvent', data: {id: '1', email: 'user@mail.com'}};
    let userAddedHandler = eventBus.register.getCall(0).args[1];

    return userAddedHandler(event).then(() => {
      repositories.userForSaga.all().should.deep.equal([{id: '1', email: 'user@mail.com'}]);
      eventBus.broadcast.should.have.been.calledWith(event);
    });
  });
});
