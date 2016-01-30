'use strict';

let Bluebird = require('bluebird');
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
    return broadcastToInterceptors().then(broadcastToListeners);

    function broadcastToInterceptors() {
      return Bluebird.map(broadcastInterceptors, interceptor => {
        return interceptor(event);
      });
    }

    function broadcastToListeners() {
      return Bluebird.map(listenerMap[event.type] || [], listener => {
        return listener(event);
      });
    }
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
