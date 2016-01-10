'use strict';

var _ = require('lodash');
var LoggerFactory = require('../../tools/LoggerFactory');
var Event = require('./Event');

function EventStore(database, options) {
  var $options = parseOptions(options);

  var self = this;
  self.add = add;
  self.findAll = findAll;
  self.catchEvents = catchEvents;

  function add(event) {
    return database.add('events', event);
  }

  function findAll() {
    var options = {orderBy: {key: 'date'}};
    return database.findAll('events', {}, options).map(toEvent);
  }

  function toEvent(properties) {
    return Object.assign(Object.create(Event.prototype), properties);
  }

  function catchEvents(eventBus) {
    $options.log.debug('Catching all events from bus');
    eventBus.addBroadcastInterceptor(self.add);
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename)
    });
  }
}

module.exports = EventStore;
