'use strict';

class Projection {
  constructor(database, collection) {
    this._database = database;
    this._collection = collection;
  }

  findFirst(criteria) {
    return this._database.findFirst(this._collection, criteria);
  }

  findAll(criteria) {
    return this._database.findAll(this._collection, criteria);
  }
}

module.exports = Projection;
