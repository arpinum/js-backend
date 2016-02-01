'use strict';

let _ = require('lodash');
let Event = require('../event/Event');
let AggregateRoot = require('./AggregateRoot');

describe('The aggregate root', () => {

  class MyRoot extends AggregateRoot {
  }

  let aggregateRoot;

  beforeEach(() => {
    aggregateRoot = new MyRoot('the id');
  });

  it('should be created with an id', () => {
    aggregateRoot.id.should.equal('the id');
  });

  it('should push some events and then return them during event flushing', () => {
    aggregateRoot.pushEvent(_.merge(new Event(), {data: {name: 'the event'}}));

    let events = aggregateRoot.flushEvents();

    events.should.have.lengthOf(1);
    events[0].data.should.deep.equal({name: 'the event'});
  });

  it('should return no event after the flush', () => {
    aggregateRoot.pushEvent(_.merge(new Event(), {data: {name: 'the event'}}));
    aggregateRoot.flushEvents();

    let events = aggregateRoot.flushEvents();

    events.should.be.empty;
  });

  it('should push events concerning the aggregate', () => {
    aggregateRoot.pushEvent(_.merge(new Event(), {data: {name: 'the event'}}));

    let events = aggregateRoot.flushEvents();

    events[0].aggregate.should.deep.equal({
      name: 'MyRoot',
      id: 'the id'
    });
  });
});
