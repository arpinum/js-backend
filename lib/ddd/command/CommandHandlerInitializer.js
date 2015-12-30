'use strict';

var util = require('util');
var ModuleInitializer = require('../../tools/ModuleInitializer');

function CommandHandlerInitializer(repositories, commandBus, options) {
  ModuleInitializer.call(this, options);
  var self = this;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;

  function createModule(module) {
    var command = new (require(module))(repositories, commandBus);
    command.registerToBus();
    return command;
  }

  function moduleSuffix() {
    return 'CommandHandler';
  }
}

util.inherits(CommandHandlerInitializer, ModuleInitializer);

module.exports = CommandHandlerInitializer;

