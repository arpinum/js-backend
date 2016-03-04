'use strict';

let _ = require('lodash');
let geo = require('../../tools/geolocation');

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

  findNear(geolocation, criteria) {
    let options = {
      spherical: true,
      distanceMultiplier: geo.radiusToMeters(1)
    };
    if (criteria) {
      options.query = criteria;
    }
    return this._database.findNear(this._collection, geolocation, options).then(results => {
      return _.map(results, result => {
        return _.assign({distance: result.distance}, result.document);
      });
    });
  }
}

module.exports = Projection;
