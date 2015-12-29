'use strict';

var _ = require('lodash');
var util = require('util');
var BaseRepository = require('../domain/repository/BaseRepository');
var MemoryDatabase = require('./MemoryDatabase');

function MemoryRepository() {
  var database = new MemoryDatabase();
  database.collections.collection = [];
  BaseRepository.call(this, database, 'collection');

  var self = this;
  self.all = all;
  self.with = doWith;
  self.withAll = withAll;

  function all() {
    return database.collections.collection;
  }

  function doWith(entity) {
    database.collections.collection.push(entity);
    return self;
  }

  function withAll(newEntities) {
    _.forEach(newEntities, function (entity) {
      database.collections.collection.push(entity);
    });
    return self;
  }
}

util.inherits(MemoryRepository, BaseRepository);

module.exports = MemoryRepository;
