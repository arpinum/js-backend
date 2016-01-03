'use strict';

require('chai').should();
var sinon = require('sinon');
var path = require('path');
var CommandHandlerInitializer = require('./CommandHandlerInitializer');
var FakeRepository = require('../../test/FakeRepository');
var repositoryInMemory = require('../../test/repositoryInMemory');

describe('The command handler initializer', function () {

  var repositories;
  var buses;

  beforeEach(function () {
    repositories = {user: repositoryInMemory(FakeRepository)};
    buses = {
      command: {register: sinon.stub()},
      type: {broadcast: sinon.stub()}
    };
    var rootDirectory = path.resolve(__dirname, '../../test/initializersTests/commands');
    var initializer = new CommandHandlerInitializer(repositories, buses, {rootDirectory: rootDirectory});
    return initializer.initialize();
  });

  it('should find all command handler and register them to the bus', function () {
    buses.command.register.should.have.been.calledTwice;
    buses.command.register.should.have.been.calledWith('addUserCommand');
    buses.command.register.should.have.been.calledWith('veryLastCommand');
  });

  it('should initialize a fully working handler', function () {
    var command = {id: '1', email: 'email'};

    return handler()(command).then(function () {
      repositories.user.all().should.deep.equal([command]);
      buses.type.broadcast.should.have.been.calledWith('userAdddEvent', command);
    });
  });

  function handler() {
    return buses.command.register.firstCall.args[1];
  }
});
