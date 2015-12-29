'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var path = require('path');
var glob = Bluebird.promisify(require('glob'));
var LoggerFactory = require('../tools/LoggerFactory');
var TechnicalError = require('../tools/error/TechnicalError');

function ModuleInitializer(options) {
  var $options = parseOptions(options);
  var self = this;
  self.initialize = initialize;
  self.createModule = createModule;
  self.moduleSuffix = moduleSuffix;

  function initialize() {
    var modules = {};
    return glob(pattern())
      .each(function (module) {
        $options.log.debug('Initializing', module);
        var key = _.camelCase(path.basename(module).replace(self.moduleSuffix() + '.js', ''));
        modules[key] = self.createModule(module);
      })
      .return(modules);
  }

  function pattern() {
    return path.join(path.resolve($options.rootDirectory), '/**/*' + self.moduleSuffix() + '.js');
  }

  function createModule() {
    throw new TechnicalError('To define');
  }

  function moduleSuffix() {
    throw new TechnicalError('To define');
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename),
      rootDirectory: './lib'
    });
  }
}

module.exports = ModuleInitializer;
