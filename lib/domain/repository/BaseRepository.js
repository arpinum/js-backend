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
    var crit = findCriteria(criteria);
    return database
      .findAll(collection, withTechnicalId(crit))
      .then(withFunctionalIds);
  }

  function findFirst(criteria) {
    var crit = findCriteria(criteria);
    var promise = database.findFirst(collection, crit);
    return promise.then(function (entity) {
      if (!entity) {
        throw new EntityNotFoundError(criteria);
      }
      return withFunctionalId(entity);
    });
  }

  function count(criteria) {
    var crit = findCriteria(criteria);
    return database.count(collection, crit);
  }

  function exist(criteria) {
    var crit = findCriteria(criteria);
    return database.count(collection, crit).then(function (count) {
      return count > 0;
    });
  }

  function findCriteria(criteria) {
    var result = _.merge({}, DEFAULT_CRITERIA, criteria);
    return withTechnicalId(result);
  }

  function add(entity) {
    var id = uuid.v4();
    var now = options.currentDateFunction();
    var mandatoryProperties = {
      _id: id,
      creation_date: now,
      update_date: now
    };
    var entityWithId = _.merge(entity, mandatoryProperties);
    return database.add(collection, entityWithId).return({id: id});
  }

  function updatePartially(partialEntity) {
    var criteria = {_id: partialEntity.id};
    var update = {replace: {update_date: options.currentDateFunction()}};
    _.merge(update.replace, _.omit(partialEntity, 'id'));
    return database
      .update(collection, criteria, update)
      .return();
  }

  function doDelete(criteria) {
    var crit = withTechnicalId(criteria);
    var now = options.currentDateFunction();
    var update = {
      replace: {
        update_date: now,
        deletion_date: now
      }
    };
    return database
      .update(collection, crit, update)
      .return();
  }

  function withFunctionalIds(entities) {
    return _.map(entities, withFunctionalId);
  }

  function withFunctionalId(entity) {
    return _.omit(_.merge({id: entity._id}, entity), '_id');
  }

  function withTechnicalId(criteria) {
    if (criteria.id) {
      return _.omit(_.merge({_id: criteria.id}, criteria), 'id');
    }
    return criteria;
  }
}

module.exports = BaseRepository;
