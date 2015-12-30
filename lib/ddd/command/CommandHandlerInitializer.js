'use strict';

var util = require('util');
var path = require('path');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function CommandHandlerInitializer(repositories, buses, options) {
  ModuleInitializer.call(this, options);
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;

  function createModule(module) {
    var handler = require(module)(repositories, buses);
    var command = path.basename(module).replace('Handler.js', '');
    buses.command.register(command, handler);
    return handler;
  }

  function moduleSuffix() {
    return 'CommandHandler';
  }
}

util.inherits(CommandHandlerInitializer, ModuleInitializer);

module.exports = CommandHandlerInitializer;

