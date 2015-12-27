'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');
var EntityNotFoundError = require('../../domain/errors/EntityNotFoundError');

function BaseRepository(database, collection, opts) {
  var options = _.defaults(opts || {}, {
    currentDateFunction: function () {
      return new Date();
    }
  });
  var DEFAULT_CRITERIA = {deletion_date: null};

  this.findAll = findAll;
  this.findFirst = findFirst;
  this.count = count;
  this.exist = exist;
  this.add = add;
  this.updatePartially = updatePartially;
  this.delete = doDelete;

  function findAll(criteria) {
    return database.findAll(collection, findCriteria(criteria));
  }

  function findFirst(criteria) {
    var crit = findCriteria(criteria);
    var promise = database.findFirst(collection, crit);
    return promise.then(function (entity) {
      if (!entity) {
        throw new EntityNotFoundError(criteria);
      }
      return entity;
    });
  }

  function count(criteria) {
    return database.count(collection, findCriteria(criteria));
  }

  function exist(criteria) {
    var crit = findCriteria(criteria);
    return database.count(collection, crit).then(function (count) {
      return count > 0;
    });
  }

  function findCriteria(criteria) {
    return _.merge({}, DEFAULT_CRITERIA, criteria);
  }

  function add(entity) {
    var id = uuid.v4();
    var now = options.currentDateFunction();
    var mandatoryProperties = {
      id: id,
      creation_date: now,
      update_date: now
    };
    var entityWithId = _.merge(entity, mandatoryProperties);
    return database.add(collection, entityWithId).return({id: id});
  }

  function updatePartially(partialEntity) {
    var criteria = {id: partialEntity.id};
    var update = {replace: {update_date: options.currentDateFunction()}};
    _.merge(update.replace, _.omit(partialEntity, 'id'));
    return database
      .update(collection, criteria, update)
      .return();
  }

  function doDelete(criteria) {
    var now = options.currentDateFunction();
    var update = {
      replace: {
        update_date: now,
        deletion_date: now
      }
    };
    return database
      .update(collection, criteria, update)
      .return();
  }
}

module.exports = BaseRepository;
