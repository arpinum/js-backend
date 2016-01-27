'use strict';

let Bluebird = require('bluebird');
let EntityNotFoundError = require('../error/EntityNotFoundError');
let FunctionalError = require('../../tools/error/FunctionalError');

class BaseRepository {
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

  add(entity) {
    return Bluebird.try(() => {
      if (!entity.id) {
        throw new FunctionalError('Entity must have an id');
      }
      return this._database.add(this._collection, entity).return();
    });
  }

  updateFirst(criteria, update) {
    return this._database
      .updateFirst(this._collection, criteria, update)
      .return();
  }

  deleteFirst(criteria) {
    return this._database
      .deleteFirst(this._collection, {id: criteria.id})
      .return();
  }
}

module.exports = BaseRepository;
