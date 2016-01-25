'use strict';

let _ = require('lodash');
let MemoryDatabase = require('./MemoryDatabase');

function repositoryInMemory(RepositoryType) {
  let database = new MemoryDatabase();

  class Repository extends RepositoryType {
    all() {
      return database.collections[this.collection];
    }

    with(entity) {
      database.collections[this.collection].push(entity);
      return this;
    }

    withAll(newEntities) {
      _.forEach(newEntities, entity => {
        database.collections[this.collection].push(entity);
      });
      return this;
    }
  }

  var repository = new Repository(database);
  database.collections[repository.collection] = [];
  return repository;
}

module.exports = repositoryInMemory;
