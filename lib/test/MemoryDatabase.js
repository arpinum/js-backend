'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');

function MemoryDatabase() {

  var self = this;
  self.collections = {};
  self.initialize = initialize;
  self.close = close;
  self.findAll = findAll;
  self.findFirst = findFirst;
  self.count = count;
  self.add = add;
  self.updateFirst = updateFirst;
  self.deleteFirst = deleteFirst;

  function initialize() {
    return Bluebird.resolve();
  }

  function close() {
  }

  function findAll(collectionName, criteria, options) {
    return Bluebird.try(function () {
      var documents = documentsFrom(collectionName);
      if (criteria) {
        var filtered = _.filter(documents, function (document) {
          return match(document, criteria);
        });
        return withFindOptionsApplied(filtered, options || {});
      }
      return documents;
    });
  }

  function withFindOptionsApplied(documents, options) {
    if (options.orderBy) {
      var order = options.orderBy.order || 'asc';
      return _.sortByOrder(documents, options.orderBy.key, order);
    }
    return documents;
  }

  function findFirst(collectionName, criteria) {
    return findAll(collectionName, criteria).then(function (documents) {
      return _.first(documents);
    });
  }

  function count(collectionName, criteria) {
    return findAll(collectionName, criteria).then(function (documents) {
      return documents.length;
    });
  }

  function add(collectionName, document) {
    return Bluebird.try(function () {
      addDocument(collectionName, document);
      return {};
    });
  }

  function updateFirst(collectionName, criteria, modification) {
    return findFirst(collectionName, criteria).then(function (document) {
      if (document) {
        _.merge(document, modification);
      }
    });
  }

  function deleteFirst(collectionName, criteria) {
    return findFirst(collectionName, criteria).then(function (document) {
      self.collections[collectionName] = _.without(documentsFrom(collectionName), document);
    });
  }

  function documentsFrom(collectionName) {
    return self.collections[collectionName] || [];
  }

  function addDocument(collectionName, document) {
    if (!self.collections[collectionName]) {
      self.collections[collectionName] = [];
    }
    documentsFrom(collectionName).push(document);
  }

  function match(document, criteria) {
    return !_.any(_.keys(criteria), function (key) {
      if (criteria[key] === null) {
        return isPresent(document[key]);
      }
      if (criteria[key] !== document[key]) {
        return true;
      }
    });
  }

  function isPresent(o) {
    return o !== null && !_.isUndefined(o);
  }
}

module.exports = MemoryDatabase;
