'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var MongoClient = require('mongodb').MongoClient;
var LoggerFactory = require('../tools/LoggerFactory');
var Logger = require('mongodb').Logger;

function MongoDatabase(options) {
  var $options = parseOptions(options);
  var mongoDb;

  var self = this;
  self.initialize = initialize;
  self.close = close;
  self.findAll = findAll;
  self.findFirst = findFirst;
  self.count = count;
  self.add = add;
  self.updateFirst = updateFirst;
  self.deleteFirst = deleteFirst;

  function initialize() {
    return new Bluebird(function (resolve, reject) {
      Logger.setLevel($options.databaseLogLevel);
      MongoClient.connect($options.databaseUrl, function (error, db) {
        if (error) {
          reject('Impossible to connect to database: ' + error.message);
        } else {
          mongoDb = db;
          $options.log.info('Connection to database successful');
          resolve(self);
        }
      });
    });
  }

  function close() {
    mongoDb.close();
  }

  function findAll(collectionName, criteria, options) {
    return new Bluebird(function (resolve, reject) {
      var collection = mongoDb.collection(collectionName);
      var foundDocuments = collection.find(withMongoId(criteria));
      foundDocuments = withFindOptionsApplied(foundDocuments, options || {});
      return foundDocuments.toArray(function (error, docs) {
        if (error) {
          reject(error);
        } else {
          resolve(withIds(docs));
        }
      });
    });
  }

  function withFindOptionsApplied(foundDocuments, options) {
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

  function findFirst(collectionName, criteria) {
    return new Bluebird(function (resolve, reject) {
      var collection = mongoDb.collection(collectionName);
      collection.findOne(withMongoId(criteria), function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(withId(doc));
        }
      });
    });
  }

  function count(collectionName, criteria) {
    return Bluebird.try(function () {
      var collection = mongoDb.collection(collectionName);
      return collection.count(withMongoId(criteria));
    });
  }

  function add(collectionName, document) {
    return new Bluebird(function (resolve, reject) {
      var collection = mongoDb.collection(collectionName);
      collection.insertOne(withMongoId(document), function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  function updateFirst(collectionName, criteria, update) {
    return new Bluebird(function (resolve, reject) {
      var collection = mongoDb.collection(collectionName);
      collection.updateOne(withMongoId(criteria), {$set: update}, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  function deleteFirst(collectionName, criteria) {
    return new Bluebird(function (resolve, reject) {
      var collection = mongoDb.collection(collectionName);
      collection.deleteOne(withMongoId(criteria), function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  function withIds(documents) {
    return _.map(documents, withId);
  }

  function withId(document) {
    if (!document) {
      return document;
    }
    return _.omit(_.merge({id: document._id}, document), '_id');
  }

  function withMongoId(criteria) {
    var $criteria = criteria || {};
    if ($criteria.id) {
      return _.omit(_.merge({_id: $criteria.id}, $criteria), 'id');
    }
    return $criteria;
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename),
      databaseLogLevel: 'info',
      databaseUrl: 'to define'
    });
  }
}

module.exports = MongoDatabase;
