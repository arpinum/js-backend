'use strict';

let _ = require('lodash');
let ModuleInitializer = require('../../tools/ModuleInitializer');
let conventions = require('../conventions');

class SagaHandlerInitializer extends ModuleInitializer {

  constructor(buses, options) {
    super(options);
    this._buses = buses;
  }

  createModule(module) {
    let initializedModule = new (require(module))(this._buses);
    _.forEach(this.matchingKeys(initializedModule, conventions.eventHandlerRegex), handlerKey => {
      let event = _.camelCase(handlerKey.replace(conventions.eventHandlerRegex, '$1'));
      this._buses.event.register(event, _.bind(initializedModule[handlerKey], initializedModule));
    });
    return initializedModule;
  }

  moduleSuffix() {
    return 'SagaHandler';
  }
}

module.exports = SagaHandlerInitializer;

