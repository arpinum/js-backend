'use strict';

let Bluebird = require('bluebird');
let EventBus = require('./EventBus');

describe('The event bus', () => {
  let bus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should broadcast the event to the listeners', () => {
    let broadcast = [];
    bus.register('MyEvent', () => {
      return Bluebird.try(() => broadcast.push('first listener'));
    });
    bus.register('MyEvent', () => {
      return Bluebird.try(() => broadcast.push('second listener'));
    });

    let promise = bus.broadcast({type: 'MyEvent'});

    return promise.then(() => {
      broadcast.should.deep.equal(['first listener', 'second listener']);
    });
  });

  it('wont broadcast to the wrong listener', () => {
    let broadcast = [];
    bus.register('MyRightEvent', () => {
      return Bluebird.try(() => broadcast.push('first listener'));
    });
    bus.register('MyWrongEvent', () => {
      return Bluebird.try(() => broadcast.push('second listener'));
    });

    let promise = bus.broadcast({type: 'MyRightEvent'});

    return promise.then(() => {
      broadcast.should.deep.equal(['first listener']);
    });
  });

  it('should broadcast multiple events sequentially', () => {
    let broadcast = [];
    bus.register('Event1', () => {
      return Bluebird.delay(50).then(() => broadcast.push('listener 1'));
    });
    bus.register('Event2', () => {
      return Bluebird.delay(10).then(() => broadcast.push('listener 2'));
    });
    bus.register('Event3', () => {
      return Bluebird.delay(20).then(() => broadcast.push('listener 3'));
    });

    let promise = bus.broadcastSeries([{type: 'Event1'}, {type: 'Event2'}, {type: 'Event3'}]);

    return promise.then(() => {
      broadcast.should.deep.equal(['listener 1', 'listener 2', 'listener 3']);
    });
  });

  it('should accept broadcast interception', () => {
    let interceptions = [];
    bus.addBroadcastInterceptor(event => {
      return Bluebird.try(() => interceptions.push(event));
    });

    let promise = bus.broadcast({type: 'MyEvent'});

    return promise.then(() => {
      interceptions.should.deep.equal([{type: 'MyEvent'}]);
    });
  });
});
