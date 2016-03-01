'use strict';

let path = require('path');
let ModuleInitializer = require('../../tools/ModuleInitializer');

class CommandHandlerInitializer extends ModuleInitializer {

  constructor(repositories, buses, options) {
    super(options);
    this._repositories = repositories;
    this._buses = buses;
  }

  createModule(module) {
    let handler = require(module)(this._repositories, this._buses);
    let command = path.basename(module).replace('Handler.js', '');
    this._buses.command.register(command, handler);
  }

  moduleSuffix() {
    return 'CommandHandler';
  }
}

module.exports = CommandHandlerInitializer;

