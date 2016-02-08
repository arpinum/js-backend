'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');

class MemoryDatabase {
  constructor() {
    this.collections = {};
  }

  initialize() {
    return Bluebird.resolve();
  }

  close() {
  }

  findAll(collectionName, criteria, options) {
    return Bluebird.try(() => {
      var documents = this._documentsFrom(collectionName);
      if (criteria) {
        var filtered = _.filter(documents, document => {
          return this._match(document, criteria);
        });
        return this._withFindOptionsApplied(filtered, options || {});
      }
      return documents;
    });
  }

  _withFindOptionsApplied(documents, options) {
    if (options.orderBy) {
      var order = options.orderBy.order || 'asc';
      return _.sortByOrder(documents, options.orderBy.key, order);
    }
    return documents;
  }

  findFirst(collectionName, criteria) {
    return this.findAll(collectionName, criteria).then(documents => {
      return _.first(documents);
    });
  }

  findNear() {
    // mock me please :)
    return Bluebird.resolve([]);
  }

  count(collectionName, criteria) {
    return this.findAll(collectionName, criteria).then(documents => {
      return documents.length;
    });
  }

  add(collectionName, document) {
    return Bluebird.try(() => {
      this.addDocument(collectionName, document);
      return {};
    });
  }

  updateFirst(collectionName, criteria, modification) {
    return this.findFirst(collectionName, criteria).then(document => {
      if (document && modification.$set) {
        _.assign(document, modification.$set);
      }
    });
  }

  replaceFirst(collectionName, criteria, document, options) {
    let _options = _.defaults(options || {}, {upsert: false});
    return this.findFirst(collectionName, criteria).then(oldDocument => {
      if (oldDocument) {
        _.forOwn(oldDocument, (value, key) => {
          delete oldDocument[key];
        });
        _.assign(oldDocument, document);
      } else {
        if (_options.upsert) {
          return this.add(collectionName, document);
        }
      }
    });
  }

  deleteFirst(collectionName, criteria) {
    return this.findFirst(collectionName, criteria).then(document => {
      this.collections[collectionName] = _.without(this._documentsFrom(collectionName), document);
    });
  }

  addDocument(collectionName, document) {
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = [];
    }
    this._documentsFrom(collectionName).push(document);
  }

  _documentsFrom(collectionName) {
    return this.collections[collectionName] || [];
  }

  _match(document, criteria) {
    return !_.any(_.keys(criteria), key => {
      if (criteria[key] === null) {
        return this._isPresent(document[key]);
      }
      if (_.isArray(document[key]) && !_.isArray(criteria[key])) {
        return !_.contains(document[key], criteria[key]);
      }
      if (_.isObject(criteria[key]) && _.isObject(document[key])) {
        return !this._match(document[key], criteria[key]);
      }
      if (criteria[key] !== document[key]) {
        return true;
      }
    });
  }

  _isPresent(o) {
    return o !== null && !_.isUndefined(o);
  }
}

module.exports = MemoryDatabase;
