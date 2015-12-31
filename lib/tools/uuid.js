'use strict';

var uuid = require('node-uuid');

module.exports = {
  create: uuid.v4,
  regex: /.{8}-.{4}-.{4}-.{4}-.{12}/
};
