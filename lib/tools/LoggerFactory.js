'use strict';

var _ = require('lodash');
var path = require('path');
var winston = require('winston');

function LoggerFactory(options) {
  var $options = parseOptions(options);
  var self = this;

  self.create = create;

  function create(fileName) {
    var loggerOptions = {
      level: $options.level,
      transports: [
        new winston.transports.Console({
          timestamp: true,
          label: path.basename(fileName)
        })
      ]
    };
    return new winston.Logger(loggerOptions);
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      level: process.env.ARPINUM_BACKEND__LOG_LEVEL || 'info'
    });
  }
}

module.exports = LoggerFactory;
