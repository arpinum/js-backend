'use strict';

require('chai').should();
var sinon = require('sinon');
var MemoryDatabase = require('../../test/MemoryDatabase');
var Event = require('./Event');
var EventStore = require('./EventStore');

describe('The event store', () => {

  var database;
  var eventStore;
  var eventBus;

  beforeEach(() => {
    database = new MemoryDatabase();
    eventBus = {addBroadcastInterceptor: sinon.stub()};
    eventStore = new EventStore(database);
  });

  it('should add an event to the database', () => {
    var event = new Event('the type', {the: 'data'});

    var add = eventStore.add(event);

    return add.then(() => {
      database.collections.events.should.deep.equal([event]);
    });
  });

  it('should retrieve events from database', () => {
    database.collections.events = [
      {type: 'myEvent', date: new Date(2010, 3, 5), data: {the: 'data'}}
    ];

    var findAll = eventStore.findAll();

    return findAll.then(function (events) {
      events[0].should.be.instanceOf(Event);
    });
  });

  it('should find all events ordered by date', () => {
    database.collections.events = [
      {date: new Date(2010, 3, 5)},
      {date: new Date(2015, 3, 5)},
      {date: new Date(2012, 3, 5)}
    ];

    var findAll = eventStore.findAll();

    var expectedEvents = [
      {date: new Date(2010, 3, 5)},
      {date: new Date(2012, 3, 5)},
      {date: new Date(2015, 3, 5)}
    ];
    return findAll.should.eventually.deep.equal(expectedEvents);
  });

  it('should configure the event bus to send events to the event store', () => {
    eventStore.catchEvents(eventBus);

    eventBus.addBroadcastInterceptor.should.have.been.calledWith(eventStore.add);
  });
});
