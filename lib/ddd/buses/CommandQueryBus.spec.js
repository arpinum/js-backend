'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var _ = require('lodash');
var Bluebird = require('bluebird');
var CommandQueryBus = require('./CommandQueryBus');
var TechnicalError = require('../../tools/errors/TechnicalError');

describe('The command query bus', function () {
  var bus;

  beforeEach(function () {
    bus = new CommandQueryBus();
  });

  it('should broadcast the message to the listeners', function () {
    bus.register('MyMessage', {
      run: function () {
        return Bluebird.resolve('myMessage run');
      }
    });

    var broadcast = bus.broadcast('MyMessage', {});

    return broadcast.should.eventually.equal('myMessage run');
  });

  it('wont broadcast to the wrong listener', function () {
    bus.register('MyRightMessage', {
      run: function () {
        return Bluebird.resolve('my right message');
      }
    });
    bus.register('MyWrongMessage', {
      run: function () {
        return Bluebird.resolve('my wrong message');
      }
    });

    var broadcast = bus.broadcast('MyRightMessage', {});

    return broadcast.should.eventually.equal('my right message');
  });

  it('should broadcast with some data', function () {
    bus.register('MyMessage', {
      run: function () {
        return Bluebird.resolve('myMessage run with ' + _.toArray(arguments));
      }
    });

    var broadcast = bus.broadcast('MyMessage', 'arg 1', 'arg 2');

    return broadcast.should.eventually.equal('myMessage run with ' + ['arg 1', 'arg 2']);
  });

  it('should reject when broadcasting is done without listener', function () {
    var broadcast = bus.broadcast('MyMessage', {});

    return broadcast.should.be.rejectedWith(TechnicalError, 'No listener for MyMessage');
  });
});
