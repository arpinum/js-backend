'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');
var uuid = require('node-uuid');
var EntityNotFoundError = require('../domain/errors/EntityNotFoundError');

function MemoryRepository() {
  var entities = [];

  var self = this;
  self.findAll = findAll;
  self.findFirst = findFirst;
  self.findAll = findAll;
  self.count = count;
  self.exist = exist;
  self.tous = tous;
  self.add = add;
  self.updatePartially = updatePartially;
  self.delete = doDelete;
  self.supprimeDéfinitivement = supprimeDéfinitivement;
  self.with = doWith;
  self.withAll = withAll;

  function findAll(criteria) {
    if (criteria) {
      return Bluebird.resolve(_.filter(entities, _.matches(criteria)));
    }
    return Bluebird.resolve(entities);
  }

  function findFirst(criteria) {
    return Bluebird.try(function () {
      var entity = _.first(_.filter(entities, _.matches(criteria)));
      if (!entity) {
        throw new EntityNotFoundError(criteria);
      }
      return entity;
    });
  }

  function count(criteria) {
    return findAll(criteria).then(function (entities) {
      return entities.length;
    });
  }

  function exist(criteria) {
    return count(criteria).then(function (count) {
      return count > 0;
    });
  }

  function tous() {
    return entities;
  }

  function add(entity) {
    entity.id = uuid.v4();
    self.with(entity);
    return Bluebird.resolve({id: entity.id});
  }

  function updatePartially(partialEntity) {
    return self.findFirst({id: partialEntity.id}).then(function (entity) {
      _.merge(entity, partialEntity);
      return {id: partialEntity.id};
    });
  }

  function doDelete(criteria) {
    return findAll(criteria).each(function (entity) {
      _.remove(entities, function (e) {
        return e.id === entity.id;
      });
    });
  }

  function supprimeDéfinitivement(criteria) {
    return doDelete(criteria);
  }

  function doWith(entity) {
    entities.push(entity);
    return self;
  }

  function withAll(entitésSupplémentaires) {
    entities = _.union(entities, entitésSupplémentaires);
    return self;
  }
}

module.exports = MemoryRepository;
