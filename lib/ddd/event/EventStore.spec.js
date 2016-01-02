'use strict';

require('chai').should();
var sinon = require('sinon');
var _ = require('lodash');
var MemoryDatabase = require('../../test/MemoryDatabase');
var EventStore = require('./EventStore');

describe('The event store', function () {

  var database;
  var eventStore;
  var now;
  var eventBus;

  beforeEach(function () {
    database = new MemoryDatabase();
    now = new Date();
    eventBus = {addBroadcastInterceptor: sinon.stub()};
    eventStore = new EventStore(database, {createDate: _.constant(now)});
  });

  it('should add an event to the database', function () {
    var add = eventStore.add('the type', {the: 'data'});

    return add.then(function () {
      var expectedEvent = {
        type: 'the type',
        data: {the: 'data'},
        date: now
      };
      database.collections.events.should.deep.equal([expectedEvent]);
    });
  });

  it('should find all events ordered by date', function () {
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

  it('should configure the event bus to send events to the event store', function () {
    eventStore.catchEvents(eventBus);

    eventBus.addBroadcastInterceptor.should.have.been.calledWith(eventStore.add);
  });
});
