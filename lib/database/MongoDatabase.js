'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var MongoClient = require('mongodb').MongoClient;
var LoggerFactory = require('../tools/LoggerFactory');
var Logger = require('mongodb').Logger;

class MongoDatabase {
  constructor(options) {
    this._options = this._parseOptions(options);
  }

  initialize() {
    return new Promise((resolve, reject) => {
      Logger.setLevel(this._options.databaseLogLevel);
      MongoClient.connect(this._options.databaseUrl, (error, db) => {
        if (error) {
          reject('Impossible to connect to database: ' + error.message);
        } else {
          this._mongoDb = db;
          this._options.log.info('Connection to database successful');
          resolve(this);
        }
      });
    });
  }

  close() {
    this._mongoDb.close();
  }

  findAll(collectionName, criteria, options) {
    return new Promise((resolve, reject) => {
      var collection = this._mongoDb.collection(collectionName);
      var foundDocuments = collection.find(this._withMongoId(criteria));
      foundDocuments = this._withFindOptionsApplied(foundDocuments, options || {});
      return foundDocuments.toArray((error, docs) => {
        if (error) {
          reject(error);
        } else {
          resolve(this._withIds(docs));
        }
      });
    });
  }

  _withFindOptionsApplied(foundDocuments, options) {
    if (options.orderBy) {
      var sort = {order: 1};
      if (options.orderBy.order === 'desc') {
        sort.order = -1;
      }
      sort[options.orderBy.key] = sort.order;
      return foundDocuments.sort(sort);
    }
    return foundDocuments;
  }

  findFirst(collectionName, criteria) {
    return new Promise((resolve, reject) => {
      var collection = this._mongoDb.collection(collectionName);
      collection.findOne(this._withMongoId(criteria), (error, doc) => {
        if (error) {
          reject(error);
        } else {
          resolve(this._withId(doc));
        }
      });
    });
  }

  findNear(collectionName, geolocation, options) {
    return new Promise((resolve, reject) => {
      var collection = this._mongoDb.collection(collectionName);
      collection.geoNear(geolocation.longitude, geolocation.latitude, options, (error, response) => {
        if (error) {
          reject(error);
        } else {
          let results = _.map(response.results, result => {
            return {
              distance: result.dis,
              document: this._withId(result.obj)
            };
          });
          resolve(results);
        }
      });
    });
  }

  count(collectionName, criteria) {
    return Bluebird.try(() => {
      var collection = this._mongoDb.collection(collectionName);
      return collection.count(this._withMongoId(criteria));
    });
  }

  add(collectionName, document) {
    return new Promise((resolve, reject) => {
      var collection = this._mongoDb.collection(collectionName);
      collection.insertOne(this._withMongoId(document), (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  updateFirst(collectionName, criteria, update) {
    return new Promise((resolve, reject) => {
      var collection = this._mongoDb.collection(collectionName);
      collection.updateOne(this._withMongoId(criteria), {$set: update}, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  deleteFirst(collectionName, criteria) {
    return new Promise((resolve, reject) => {
      var collection = this._mongoDb.collection(collectionName);
      collection.deleteOne(this._withMongoId(criteria), (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  _withIds(documents) {
    return _.map(documents, this._withId);
  }

  _withId(document) {
    if (!document) {
      return document;
    }
    return _.omit(_.merge({id: document._id}, document), '_id');
  }

  _withMongoId(criteria) {
    var $criteria = criteria || {};
    if ($criteria.id) {
      return _.omit(_.merge({_id: $criteria.id}, $criteria), 'id');
    }
    return $criteria;
  }

  _parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename),
      databaseLogLevel: 'info',
      databaseUrl: 'to define'
    });
  }
}

module.exports = MongoDatabase;
