'use strict';

var _ = require('lodash');
var path = require('path');
var log4js = require('log4js');

function LoggerFactory(options) {
  var $options = parseOptions(options);
  configure();
  var self = this;
  self.create = create;

  function configure() {
    log4js.configure({
      appenders: [
        {
          type: 'console',
          layout: {type: 'pattern', pattern: $options.pattern}
        }
      ],
      levels: {'[all]': $options.level}
    });
  }

  function create(fileName) {
    return log4js.getLogger(path.basename(fileName));
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      pattern: '%[[%d][%p][%c]%] %m',
      level: process.env.ARPINUM_BACKEND__LOG_LEVEL || 'INFO'
    });
  }
}

module.exports = LoggerFactory;
