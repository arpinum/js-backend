'use strict';

var TechnicalError = require('../../tools/errors/TechnicalError');

function BaseCommand(repositories, commandBus) {
  var self = this;
  self.run = run;
  self.registerToBus = registerToBus;

  function run() {
    throw new TechnicalError('To define');
  }

  function registerToBus() {
    commandBus.register(self.constructor.name, self);
  }
}

module.exports = BaseCommand;
