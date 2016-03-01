'use strict';

let FunctionalError = require('../../tools/error/FunctionalError');
let Event = require('../event/Event');
let AggregateRoot = require('./AggregateRoot');

describe('The aggregate root', () => {

  class MyRoot extends AggregateRoot {
    static get relevantKeys() {
      return ['id', 'name'];
    }
  }

  class MyRootWithoutKeys extends AggregateRoot {
  }

  let aggregateRoot;

  beforeEach(() => {
    aggregateRoot = new MyRoot({id: 'the id'});
  });

  it('wont allow to be created without id', () => {
    (() => new MyRoot()).should.throw(FunctionalError, 'Entity must have an id');
  });

  it('should filter keys if specified', () => {
    let filtered = new MyRoot({id: 'the id', irrelevant: 'no thx'});

    filtered.should.deep.equal({id: 'the id'});
  });

  it('wont filter keys if not specified', () => {
    let filtered = new MyRootWithoutKeys({id: 'the id', irrelevant: 'no thx'});

    filtered.should.deep.equal({id: 'the id', irrelevant: 'no thx'});
  });

  it('should store additional information', () => {
    let root = new MyRoot({id: 'the id', name: 'toto'});

    root.should.deep.equal({id: 'the id', name: 'toto'});
  });

  it('should push some events and then return them during event flushing', () => {
    aggregateRoot.pushEvent(new Event('event', {name: 'the event'}));

    let events = aggregateRoot.flushEvents();

    events.should.have.lengthOf(1);
    events[0].data.should.deep.equal({name: 'the event'});
  });

  it('should return no event after the flush', () => {
    aggregateRoot.pushEvent(new Event('event', {name: 'the event'}));
    aggregateRoot.flushEvents();

    let events = aggregateRoot.flushEvents();

    events.should.be.empty;
  });

  it('should push events concerning the aggregate', () => {
    aggregateRoot.pushEvent(new Event('event', {name: 'the event'}));

    let events = aggregateRoot.flushEvents();

    events[0].aggregate.should.deep.equal({
      name: 'MyRoot',
      id: 'the id'
    });
  });
});
