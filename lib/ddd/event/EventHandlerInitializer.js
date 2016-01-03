'use strict';

var _ = require('lodash');
var util = require('util');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function EventHandlerInitializer(buses, options) {
  ModuleInitializer.call(this, options);
  var eventRegex = /on(.*Event)/;
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;

  function createModule(module) {
    _.forOwn(require(module)(), function (handler, eventKey) {
      if (eventRegex.test(eventKey)) {
        var event = _.camelCase(eventKey.replace(eventRegex, '$1'));
        buses.event.register(event, handler);
      }
    });
  }

  function moduleSuffix() {
    return 'EventHandler';
  }
}

util.inherits(EventHandlerInitializer, ModuleInitializer);

module.exports = EventHandlerInitializer;
