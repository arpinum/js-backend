'use strict';

var util = require('util');
var path = require('path');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function EventHandlerInitializer(eventBus, options) {
  ModuleInitializer.call(this, options);
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;

  function createModule(module) {
    var handler = require(module)();
    var event = path.basename(module).replace('Handler.js', '');
    eventBus.register(event, handler);
    return handler;
  }

  function moduleSuffix() {
    return 'EventHandler';
  }
}

util.inherits(EventHandlerInitializer, ModuleInitializer);

module.exports = EventHandlerInitializer;

