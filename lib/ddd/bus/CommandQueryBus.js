'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var TechnicalError = require('./../../tools/error/TechnicalError');
var LoggerFactory = require('./../../tools/LoggerFactory');

function CommandQueryBus(options) {
  var $options = parseOptions(options);
  var handlerMap = {};
  var self = this;
  self.broadcast = broadcast;
  self.register = register;

  function broadcast(messageType) {
    $options.log.debug('Broadcasting', messageType);
    var handler = handlerMap[messageType];
    if (!handler) {
      return rejectDueToNoHandler(messageType);
    }
    return handler.apply(handler, Array.prototype.slice.call(arguments, 1));
  }

  function rejectDueToNoHandler(messageType) {
    var error = `No handler for ${messageType}`;
    return Bluebird.reject(new TechnicalError(error));
  }

  function register(messageType, handler) {
    $options.log.debug('Registering to', messageType);
    if (handlerMap[messageType]) {
      var error = `Impossible to add another handler for ${messageType}`;
      throw new TechnicalError(error);
    }
    handlerMap[messageType] = handler;
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename)
    });
  }
}

module.exports = CommandQueryBus;
