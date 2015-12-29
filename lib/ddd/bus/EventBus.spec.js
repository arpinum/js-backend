'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var EventBus = require('./EventBus');

describe('The event bus', function () {
  var bus;

  beforeEach(function () {
    bus = new EventBus();
  });

  it('should broadcast the event to the listeners', function () {
    var broadcast = [];
    bus.register('MyEvent', function () {
      broadcast.push('first listener');
    });
    bus.register('MyEvent', function () {
      broadcast.push('second listener');
    });

    bus.broadcast('MyEvent', {});

    broadcast.should.deep.equal(['first listener', 'second listener']);
  });

  it('wont broadcast to the wrong listener', function () {
    var broadcast = [];
    bus.register('MyRightEvent', function () {
      broadcast.push('first listener');
    });
    bus.register('MyWrongEvent', function () {
      broadcast.push('second listener');
    });

    bus.broadcast('MyRightEvent', {});

    broadcast.should.deep.equal(['first listener']);
  });

  it('should broadcast with some data', function () {
    var broadcast = [];
    bus.register('MyEvent', function (arg1, arg2) {
      broadcast.push('listener: ' + arg1 + ' ' + arg2);
    });

    bus.broadcast('MyEvent', 'with', 'data');

    broadcast.should.deep.equal(['listener: with data']);
  });
});
