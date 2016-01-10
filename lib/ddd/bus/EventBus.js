'use strict';

var _ = require('lodash');
var LoggerFactory = require('./../../tools/LoggerFactory');

function EventBus(options) {
  var $options = parseOptions(options);
  var listenerMap = {};
  var broadcastInterceptors = [];

  var self = this;
  self.broadcast = broadcast;
  self.addBroadcastInterceptor = addBroadcastInterceptor;
  self.register = register;

  function broadcast(event) {
    $options.log.debug('Broadcasting', event.type);
    _.forEach(broadcastInterceptors, function (interceptor) {
      interceptor(event);
    });
    _.forEach(listenerMap[event.type], function (listener) {
      listener(event);
    });
  }

  function addBroadcastInterceptor(interceptor) {
    broadcastInterceptors.push(interceptor);
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
