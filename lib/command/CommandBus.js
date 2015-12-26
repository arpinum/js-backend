'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var Bluebird = require('bluebird');
var TechnicalError = require('../utils/errors/TechnicalError');
var LoggerFactory = require('../utils/LoggerFactory');

function CommandBus(options) {
  var $options = parseOptions(options);
  var listeners = {};
  var self = this;
  self.broadcast = broadcast;
  self.register = register;

  function broadcast(commandType) {
    $options.log.debug('Broadcasting', commandType);
    var listener = listeners[commandType];
    if (!listener) {
      return rejectDueToNoListener(commandType);
    }
    return listener.run.apply(listener, Array.prototype.slice.call(arguments, 1));
  }

  function rejectDueToNoListener(typeCommande) {
    var message = _s.sprintf('No listener for %s', typeCommande);
    return Bluebird.reject(new TechnicalError(message));
  }

  function register(commandType, command) {
    $options.log.debug('Registering to command', commandType);
    if (listeners[commandType]) {
      var message = _s.sprintf('Impossible to add another listener for %s', commandType);
      throw new TechnicalError(message);
    }
    listeners[commandType] = command;
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename)
    });
  }
}

module.exports = CommandBus;
