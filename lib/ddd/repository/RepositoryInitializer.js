'use strict';

var util = require('util');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function RepositoryInitializer(database, options) {
  ModuleInitializer.call(this, options);
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;

  function createModule(module) {
    return new (require(module))(database);
  }

  function moduleSuffix() {
    return 'Repository';
  }
}

util.inherits(RepositoryInitializer, ModuleInitializer);

module.exports = RepositoryInitializer;
