'use strict';

let ModuleInitializer = require('../../tools/ModuleInitializer');

class RepositoryInitializer extends ModuleInitializer {

  constructor(database, options) {
    super(options);
    this._database = database;
  }

  createModule(module) {
    return new (require(module))(this._database);
  }

  moduleSuffix() {
    return 'Repository';
  }

  buildModuleMap() {
    return true;
  }
}

module.exports = RepositoryInitializer;
