'use strict';

let Bluebird = require('bluebird');
let pick = require('lookalike').pick;
let EntityNotFoundError = require('../error/EntityNotFoundError');
let FunctionalError = require('../../tools/error/FunctionalError');

class Repository {

  constructor(database, collection) {
    this._database = database;
    this._collection = collection;
  }

  toEntity(object) {
    return object;
  }

  findAll(criteria) {
    return this._database
      .findAll(this._collection, criteria)
      .map(o => this.toEntity(o));
  }

  findFirst(criteria) {
    let promise = this._database.findFirst(this._collection, criteria);
    return promise.then(entity => {
      if (!entity) {
        throw new EntityNotFoundError(criteria);
      }
      return this.toEntity(entity);
    });
  }

  count(criteria) {
    return this._database.count(this._collection, criteria);
  }

  exist(criteria) {
    return this._database.count(this._collection, criteria).then(count => {
      return count > 0;
    });
  }

  save(entity) {
    return Bluebird.try(() => {
      if (!entity.id) {
        throw new FunctionalError('Entity must have an id');
      }
      return this._database.replaceFirst(this._collection, {id: entity.id}, relevantEntity(), {upsert: true}).return();
    });

    function relevantEntity() {
      if (entity.constructor.relevantKeys) {
        return pick(entity, entity.constructor.relevantKeys);
      }
      return entity;
    }
  }

  deleteFirst(criteria) {
    return this._database
      .deleteFirst(this._collection, {id: criteria.id})
      .return();
  }
}

module.exports = Repository;
