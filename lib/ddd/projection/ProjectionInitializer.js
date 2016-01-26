'use strict';

var _ = require('lodash');
var util = require('util');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function ProjectionInitializer(database, buses, options) {
  ModuleInitializer.call(this, options);
  var eventRegex = /on(.*Event)/;
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;
  self.buildModuleMap = buildModuleMap;

  function createModule(module) {
    var initializedModule = new (require(module))(database);
    for (let method of methods(initializedModule)) {
      if (eventRegex.test(method)) {
        var event = _.camelCase(method.replace(eventRegex, '$1'));
        buses.event.register(event, _.bind(initializedModule[method], initializedModule));
      }
    }
    return initializedModule;
  }

  function methods(initializedModule) {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(initializedModule));
  }

  function moduleSuffix() {
    return 'Projection';
  }

  function buildModuleMap() {
    return true;
  }
}

util.inherits(ProjectionInitializer, ModuleInitializer);

module.exports = ProjectionInitializer;

