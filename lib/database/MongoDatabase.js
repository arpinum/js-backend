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
  self.update = update;

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

  function findAll(collectionName, criteria) {
    return new Bluebird(function (resolve, reject) {
      var collection = mongoDb.collection(collectionName);
      collection.find(criteria).toArray(function (error, docs) {
        if (error) {
          reject(error);
        } else {
          resolve(docs);
        }
      });
    });
  }

  function findFirst(collectionName, criteria) {
    return new Bluebird(function (resolve, reject) {
      var collection = mongoDb.collection(collectionName);
      collection.findOne(criteria, function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    });
  }

  function count(collectionName, criteria) {
    return Bluebird.try(function () {
      var collection = mongoDb.collection(collectionName);
      return collection.count(criteria);
    });
  }

  function add(collectionName, document) {
    return new Bluebird(function (resolve, reject) {
      var collection = mongoDb.collection(collectionName);
      collection.insertOne(document, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  function update(collectionName, criteria, update) {
    return new Bluebird(function (resolve, reject) {
      var collection = mongoDb.collection(collectionName);
      collection.updateOne(criteria, mongoUpdateFrom(update), function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  function mongoUpdateFrom(update) {
    var result = {};
    if (update.replace) {
      result.$set = update.replace;
    }
    return result;
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
