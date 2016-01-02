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

  function broadcast(eventType) {
    $options.log.debug('Broadcasting', eventType);
    var args = arguments;
    _.forEach(broadcastInterceptors, function (interceptor) {
      interceptor.apply(interceptor, args);
    });
    var data = _.drop(args, 1);
    _.forEach(listenerMap[eventType], function (listener) {
      listener.apply(listener, data);
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
