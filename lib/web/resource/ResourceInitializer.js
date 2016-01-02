'use strict';

var util = require('util');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function ResourceInitializer(buses, options) {
  ModuleInitializer.call(this, options);
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;
  self.buildModuleMap = buildModuleMap;

  function createModule(module) {
    return new (require(module))(buses);
  }

  function moduleSuffix() {
    return 'Resource';
  }

  function buildModuleMap() {
    return true;
  }
}

util.inherits(ResourceInitializer, ModuleInitializer);

module.exports = ResourceInitializer;
