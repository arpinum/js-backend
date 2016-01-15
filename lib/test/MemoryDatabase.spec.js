'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var MemoryDatabase = require('./MemoryDatabase');

describe('The memory database', function () {
  var database;

  beforeEach(function () {
    database = new MemoryDatabase();
  });

  it('should find all documents for the given collection', function () {
    var documents = [
      {name: 'first document'},
      {name: 'second document'}
    ];
    database.collections.collection = documents;

    var findAll = database.findAll('collection');

    return findAll.should.eventually.deep.equal(documents);
  });

  it('wont find document in the wrong collection', function () {
    database.collections.collection = [{name: 'first document'}];

    var findAll = database.findAll('wrong collection');

    return findAll.should.eventually.deep.equal([]);
  });

  it('should find all documents based on criteria', function () {
    var documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    var findAll = database.findAll('collection', {name: 'document'});

    var expected = [
      {id: '1', name: 'document'},
      {id: '3', name: 'document'}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents based on deep criteria', function () {
    var documents = [
      {id: '1', property: {deep: 'right'}},
      {id: '2', property: {deep: 'wrong'}},
      {id: '3', property: {deep: 'right'}}
    ];
    database.collections.collection = documents;

    var findAll = database.findAll('collection', {property: {deep: 'right'}});

    var expected = [
      {id: '1', property: {deep: 'right'}},
      {id: '3', property: {deep: 'right'}}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents with ascending order', function () {
    var documents = [
      {id: '1', name: 'a'},
      {id: '2', name: 'c'},
      {id: '3', name: 'b'}
    ];
    database.collections.collection = documents;

    var findAll = database.findAll('collection', {}, {orderBy: {key: 'name', order: 'asc'}});

    var expected = [
      {id: '1', name: 'a'},
      {id: '3', name: 'b'},
      {id: '2', name: 'c'}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents with descending order', function () {
    var documents = [
      {id: '1', name: 'a'},
      {id: '2', name: 'c'},
      {id: '3', name: 'b'}
    ];
    database.collections.collection = documents;

    var findAll = database.findAll('collection', {}, {orderBy: {key: 'name', order: 'desc'}});

    var expected = [
      {id: '2', name: 'c'},
      {id: '3', name: 'b'},
      {id: '1', name: 'a'}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents based on criteria though some are null', function () {
    var documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document', date: 'today'}
    ];
    database.collections.collection = documents;

    var findAll = database.findAll('collection', {name: 'document', date: null});

    return findAll.should.eventually.deep.equal([{id: '1', name: 'document'}]);
  });

  it('should find first document based on criteria', function () {
    var documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    var findFirst = database.findFirst('collection', {name: 'document'});

    return findFirst.should.eventually.deep.equal({id: '1', name: 'document'});
  });

  it('should count documents based on criteria', function () {
    var documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    var count = database.count('collection', {name: 'document'});

    return count.should.eventually.equal(2);
  });

  it('should add document', function () {
    var add = database.add('collection', {name: 'document'});

    return add.then(function () {
      database.collections.collection.should.deep.equal([{name: 'document'}]);
    });
  });

  it('should replace fields in first document matching criteria', function () {
    var documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    var update = database.updateFirst('collection', {name: 'document'}, {name: 'new name'});

    return update.then(function () {
      var expectedDocuments = [
        {id: '1', name: 'new name'},
        {id: '2', name: 'other document'},
        {id: '3', name: 'document'}
      ];
      database.collections.collection.should.deep.equal(expectedDocuments);
    });
  });

  it('should delete first document matching criteria', function () {
    var documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    var deletion = database.deleteFirst('collection', {name: 'document'});

    return deletion.then(function () {
      var expectedDocuments = [
        {id: '2', name: 'other document'},
        {id: '3', name: 'document'}
      ];
      database.collections.collection.should.deep.equal(expectedDocuments);
    });
  });
});
