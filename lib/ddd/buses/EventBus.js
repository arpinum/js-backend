'use strict';

var _ = require('lodash');
var LoggerFactory = require('./../../tools/LoggerFactory');

function EventBus(options) {
  var $options = parseOptions(options);
  var listenerMap = {};
  var self = this;
  self.broadcast = broadcast;
  self.register = register;

  function broadcast(eventType) {
    $options.log.debug('Broadcasting', eventType);
    var data = _.drop(arguments, 1);
    _.forEach(listenerMap[eventType], function (listener) {
      listener.run.apply(listener, data);
    });
  }

  function register(eventType, listener) {
    $options.log.debug('Registering to', eventType);
    if (!listenerMap[eventType]) {
      listenerMap[eventType] = [];
    }
    listenerMap[eventType].push(listener);
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename)
    });
  }
}

module.exports = EventBus;
