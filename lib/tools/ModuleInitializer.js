'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var path = require('path');
var glob = Bluebird.promisify(require('glob'));
var LoggerFactory = require('../tools/LoggerFactory');
var TechnicalError = require('../tools/error/TechnicalError');

class ModuleInitializer {

  constructor(options) {
    this._options = this._parseOptions(options);
  }

  initialize() {
    var modules = {};
    return glob(this.pattern())
      .each(module => {
        this._options.log.debug('Initializing', module);
        var initializedModule = this.createModule(module);
        if (this.buildModuleMap()) {
          var key = _.camelCase(path.basename(module).replace(this.moduleSuffix() + '.js', ''));
          modules[key] = initializedModule;
        }
      })
      .return(modules);
  }

  pattern() {
    return path.join(path.resolve(this._options.rootDirectory), '/**/*' + this.moduleSuffix() + '.js');
  }

  createModule() {
    throw new TechnicalError('To define');
  }

  moduleSuffix() {
    throw new TechnicalError('To define');
  }

  buildModuleMap() {
    return false;
  }

  matchingKeys(module, regex) {
    let fromPrototype = Object.getOwnPropertyNames(Object.getPrototypeOf(module));
    let fromObject = Object.getOwnPropertyNames(module);
    return _.filter(_.union(fromPrototype, fromObject), m => regex.test(m));
  }

  _parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename),
      rootDirectory: './lib'
    });
  }
}

module.exports = ModuleInitializer;
