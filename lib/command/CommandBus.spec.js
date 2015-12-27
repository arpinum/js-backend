'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var _ = require('lodash');
var Bluebird = require('bluebird');
var CommandBus = require('./CommandBus');
var TechnicalError = require('../tools/errors/TechnicalError');

describe('The command bus', function () {
  var commandBus;

  beforeEach(function () {
    commandBus = new CommandBus();
  });

  it('should broadcast the command to the listener', function () {
    commandBus.register('MyCommand', {
      run: function () {
        return Bluebird.resolve('command run');
      }
    });

    var broadcast = commandBus.broadcast('MyCommand', {});

    return broadcast.should.eventually.equal('command run');
  });

  it('wont broadcast to the wrong listener', function () {
    commandBus.register('RightCommand', {
      run: function () {
        return Bluebird.resolve('right command');
      }
    });
    commandBus.register('WrongCommand', {
      run: function () {
        return Bluebird.resolve('wrong command');
      }
    });

    return commandBus.broadcast('RightCommand', {}).should.eventually.equal('right command');
  });

  it('should broadcast with some data', function () {
    commandBus.register('MyCommand', {
      run: function () {
        return Bluebird.resolve('command run with ' + _.toArray(arguments));
      }
    });

    return commandBus
      .broadcast('MyCommand', 'arg 1', 'arg 2')
      .should.eventually.equal('command run with ' + ['arg 1', 'arg 2']);
  });

  it('should reject when broadcasting is done without listener', function () {
    return commandBus.broadcast('MyCommand', {})
      .should.be.rejectedWith(TechnicalError, 'No listener for MyCommand');
  });
});
