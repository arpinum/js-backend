'use strict';

var _ = require('lodash');
var LoggerFactory = require('../../tools/LoggerFactory');

function EventStore(database, options) {
  var $options = parseOptions(options);

  var self = this;
  self.add = add;
  self.findAll = findAll;
  self.catchEvents = catchEvents;

  function add(eventType, eventData) {
    var event = {
      type: eventType,
      data: eventData,
      date: $options.createDate()
    };
    return database.add('events', event);
  }

  function findAll() {
    var options = {orderBy: {key: 'date'}};
    return database.findAll('events', {}, options);
  }

  function catchEvents(eventBus) {
    $options.log.debug('Catching all events from bus');
    eventBus.addBroadcastInterceptor(self.add);
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename),
      createDate: function () {
        return new Date();
      }
    });
  }
}

module.exports = EventStore;
