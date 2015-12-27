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
  self.all = all;
  self.add = add;
  self.updatePartially = updatePartially;
  self.delete = doDelete;
  self.forceDelete = forceDelete;
  self.with = doWith;
  self.withAll = withAll;

  function findAll(criteria) {
    return Bluebird.try(function () {
      if (criteria) {
        return _.filter(entities, _.matches(criteria));
      }
      return entities;
    });
  }

  function findFirst(criteria) {
    return findAll(criteria).then(function (entities) {
      var entity = _.first(entities);
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

  function all() {
    return entities;
  }

  function add(entity) {
    var newEntity = _.merge({}, entity, {id: uuid.v4()});
    self.with(newEntity);
    return Bluebird.resolve({id: newEntity.id});
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

  function forceDelete(criteria) {
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
