'use strict';

var util = require('util');
var path = require('path');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function QueryHandlerInitializer(projections, buses, options) {
  ModuleInitializer.call(this, options);
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;

  function createModule(module) {
    var handler = require(module)(projections);
    var command = path.basename(module).replace('Handler.js', '');
    buses.query.register(command, handler);
  }

  function moduleSuffix() {
    return 'QueryHandler';
  }
}

util.inherits(QueryHandlerInitializer, ModuleInitializer);

module.exports = QueryHandlerInitializer;

