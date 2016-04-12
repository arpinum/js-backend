'use strict';

let _ = require('lodash');
let path = require('path');
let ModuleInitializer = require('../../tools/ModuleInitializer');
let conventions = require('../conventions');

class EventHandlerInitializer extends ModuleInitializer {

  constructor(buses, options) {
    super(options);
    this._buses = buses;
  }

  createModule(module) {
    let initializedModule = require(module)(this._buses);
    if (this._singleHandler(initializedModule)) {
      return this._initializeSingleHandler(module, initializedModule);
    }
    return this._initializeMultipleHandlers(initializedModule);
  }

  _singleHandler(module) {
    return _.isFunction(module);
  }

  _initializeSingleHandler(module, initializedModule) {
    let event = path.basename(module).replace('Handler.js', '');
    this._buses.event.register(event, initializedModule);
  }

  _initializeMultipleHandlers(initializedModule) {
    _.forEach(this.matchingKeys(initializedModule, conventions.eventHandlerRegex), handlerKey => {
      let event = _.camelCase(handlerKey.replace(conventions.eventHandlerRegex, '$1'));
      this._buses.event.register(event, initializedModule[handlerKey]);
    });
  }

  moduleSuffix() {
    return 'EventHandler';
  }
}

module.exports = EventHandlerInitializer;

