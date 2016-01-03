'use strict';

var _ = require('lodash');
var util = require('util');
var MemoryDatabase = require('./MemoryDatabase');

function repositoryInMemory(RepositoryType) {
  var database = new MemoryDatabase();
  util.inherits(RepositoryConstructor, RepositoryType);
  return new RepositoryConstructor();

  function RepositoryConstructor() {
    var self = this;
    RepositoryType.call(this, database);
    database.collections[self.collection] = [];
    self.all = all;
    self.with = doWith;
    self.withAll = withAll;

    function all() {
      return database.collections[self.collection];
    }

    function doWith(entity) {
      database.collections[self.collection].push(entity);
      return self;
    }

    function withAll(newEntities) {
      _.forEach(newEntities, function (entity) {
        database.collections[self.collection].push(entity);
      });
      return self;
    }
  }
}

module.exports = repositoryInMemory;
