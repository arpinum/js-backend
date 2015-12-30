'use strict';

var util = require('util');
var path = require('path');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function QueryHandlerInitializer(queryProcessor, queryBus, options) {
  ModuleInitializer.call(this, options);
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;

  function createModule(module) {
    var handler = require(module)(queryProcessor);
    var command = path.basename(module).replace('Handler.js', '');
    queryBus.register(command, handler);
    return handler;
  }

  function moduleSuffix() {
    return 'QueryHandler';
  }
}

util.inherits(QueryHandlerInitializer, ModuleInitializer);

module.exports = QueryHandlerInitializer;

