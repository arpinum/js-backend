'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var Bluebird = require('bluebird');
var TechnicalError = require('./../../tools/error/TechnicalError');
var LoggerFactory = require('./../../tools/LoggerFactory');

function CommandQueryBus(options) {
  var $options = parseOptions(options);
  var listenerMap = {};
  var self = this;
  self.broadcast = broadcast;
  self.register = register;

  function broadcast(messageType) {
    $options.log.debug('Broadcasting', messageType);
    var listener = listenerMap[messageType];
    if (!listener) {
      return rejectDueToNoListener(messageType);
    }
    return listener.apply(listener, Array.prototype.slice.call(arguments, 1));
  }

  function rejectDueToNoListener(messageType) {
    var error = _s.sprintf('No listener for %s', messageType);
    return Bluebird.reject(new TechnicalError(error));
  }

  function register(messageType, listener) {
    $options.log.debug('Registering to', messageType);
    if (listenerMap[messageType]) {
      var error = _s.sprintf('Impossible to add another listener for %s', messageType);
      throw new TechnicalError(error);
    }
    listenerMap[messageType] = listener;
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename)
    });
  }
}

module.exports = CommandQueryBus;
