'use strict';

let _ = require('lodash');
let ModuleInitializer = require('../../tools/ModuleInitializer');
let conventions = require('../conventions');

class EventHandlerInitializer extends ModuleInitializer {

  constructor(buses, options) {
    super(options);
    this._buses = buses;
  }

  createModule(module) {
    let initializedModule = require(module)(this._buses);
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

