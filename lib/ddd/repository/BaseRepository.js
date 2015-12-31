'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');
var EntityNotFoundError = require('../error/EntityNotFoundError');
var FunctionalError = require('../../tools/error/FunctionalError');

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
    return Bluebird.try(function () {
      if (!entity.id) {
        throw new FunctionalError('Entity must have an id');
      }
      return database.add(collection, entity).return();
    });
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
