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
    _.forOwn(initializedModule, function (handler, eventKey) {
      if (eventRegex.test(eventKey)) {
        var event = _.camelCase(eventKey.replace(eventRegex, '$1'));
        buses.event.register(event, handler);
      }
    });
    return initializedModule;
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

