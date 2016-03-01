'use strict';

let path = require('path');
let ModuleInitializer = require('../../tools/ModuleInitializer');

class QueryHandlerInitializer extends ModuleInitializer {

  constructor(projections, buses, options) {
    super(options);
    this._projections = projections;
    this._buses = buses;
  }

  createModule(module) {
    let handler = require(module)(this._projections);
    let command = path.basename(module).replace('Handler.js', '');
    this._buses.query.register(command, handler);
  }

  moduleSuffix() {
    return 'QueryHandler';
  }
}

module.exports = QueryHandlerInitializer;

