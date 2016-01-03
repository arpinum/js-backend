'use strict';

var Bluebird = require('bluebird');
var EntityNotFoundError = require('../error/EntityNotFoundError');
var FunctionalError = require('../../tools/error/FunctionalError');

function BaseRepository(database, collection) {
  this.findAll = findAll;
  this.findFirst = findFirst;
  this.count = count;
  this.exist = exist;
  this.add = add;
  this.updateFirst = updateFirst;
  this.deleteFirst = deleteFirst;
  this.collection = collection;

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

  function updateFirst(criteria, update) {
    return database
      .updateFirst(collection, criteria, update)
      .return();
  }

  function deleteFirst(criteria) {
    return database
      .deleteFirst(collection, {id: criteria.id})
      .return();
  }
}

module.exports = BaseRepository;
