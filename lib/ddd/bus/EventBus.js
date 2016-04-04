'use strict';

let Bluebird = require('bluebird');
let _ = require('lodash');
let LoggerFactory = require('./../../tools/LoggerFactory');

class EventBus {

  constructor(options) {
    this._options = this._parseOptions(options);
    this._listenerMap = {};
    this._broadcastInterceptors = [];
  }

  broadcastSeries(events) {
    return Bluebird.mapSeries(events, e => this.broadcast(e));
  }

  broadcast(event) {
    this._options.log.debug('Broadcasting', event.type);
    let self = this;
    return broadcastToInterceptors().then(broadcastToListeners);

    function broadcastToInterceptors() {
      return Bluebird.mapSeries(self._broadcastInterceptors, interceptor => {
        return interceptor(event);
      });
    }

    function broadcastToListeners() {
      return Bluebird.mapSeries(self._listenerMap[event.type] || [], listener => {
        return listener(event);
      });
    }
  }

  addBroadcastInterceptor(interceptor) {
    this._broadcastInterceptors.push(interceptor);
  }

  register(eventType, listener) {
    this._options.log.debug('Registering to', eventType);
    if (!this._listenerMap[eventType]) {
      this._listenerMap[eventType] = [];
    }
    this._listenerMap[eventType].push(listener);
  }

  _parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename)
    });
  }
}

module.exports = EventBus;
