'use strict';

var TechnicalError = require('../../tools/error/TechnicalError');

function BaseCommandHandler(repositories, commandBus) {
  var self = this;
  self.run = run;
  self.registerToBus = registerToBus;

  function run() {
    throw new TechnicalError('To define');
  }

  function registerToBus() {
    var command = self.constructor.name.replace('Handler', '');
    commandBus.register(command, self.run);
  }
}

module.exports = BaseCommandHandler;
