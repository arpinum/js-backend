'use strict';

var _ = require('lodash');

function FakeApplication() {
  var self = this;
  self.middlewares = [];
  self.use = use;
  self.all = all;
  self.allArguments;

  function use(middleware) {
    self.middlewares.push(middleware);
  }

  function all() {
    self.allArguments = _.toArray(arguments);
  }
}

module.exports = FakeApplication;
