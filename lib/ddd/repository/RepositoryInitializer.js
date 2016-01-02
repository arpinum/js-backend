'use strict';

var util = require('util');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function RepositoryInitializer(database, options) {
  ModuleInitializer.call(this, options);
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;
  self.buildModuleMap = buildModuleMap;

  function createModule(module) {
    return new (require(module))(database);
  }

  function moduleSuffix() {
    return 'Repository';
  }

  function buildModuleMap() {
    return true;
  }
}

util.inherits(RepositoryInitializer, ModuleInitializer);

module.exports = RepositoryInitializer;
