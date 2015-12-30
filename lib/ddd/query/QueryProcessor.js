'use strict';

var _ = require('lodash');
var QueriedObjectNotFoundError = require('./QueriedObjectNotFoundError');

function QueryProcessor(database) {
  var self = this;
  _.merge(self, database);

  self.findAll = database.findAll;
  self.findFirst = findFirst;
  self.count = database.count;

  function findFirst(collectionName, criteria) {
    return database.findFirst(collectionName, criteria).then(function (document) {
      if (!document) {
        throw new QueriedObjectNotFoundError(criteria);
      }
      return document;
    });
  }
}

module.exports = QueryProcessor;
