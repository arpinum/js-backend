'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');
var EntityNotFoundError = require('../errors/EntityNotFoundError');

function BaseRepository(database, collection) {
  this.findAll = findAll;
  this.findFirst = findFirst;
  this.count = count;
  this.exist = exist;
  this.add = add;
  this.update = update;
  this.delete = doDelete;

  function findAll(criteria) {
    return database.findAll(collection, criteria);
  }

  function findFirst(criteria) {
    var promise = database.findFirst(collection, criteria);
    return promise.then(function (entity) {
      if (!entity) {
        throw new EntityNotFoundError(criteria);
      }
      return entity;
    });
  }

  function count(criteria) {
    return database.count(collection, criteria);
  }

  function exist(criteria) {
    return database.count(collection, criteria).then(function (count) {
      return count > 0;
    });
  }

  function add(entity) {
    var id = uuid.v4();
    var entityWithId = _.merge(entity, {id: id});
    return database.add(collection, entityWithId).return({id: id});
  }

  function update(partialEntity) {
    var criteria = {id: partialEntity.id};
    return database
      .updateFirst(collection, criteria, _.omit(partialEntity, 'id'))
      .return();
  }

  function doDelete(criteria) {
    return database
      .deleteFirst(collection, {id: criteria.id})
      .return();
  }
}

module.exports = BaseRepository;
