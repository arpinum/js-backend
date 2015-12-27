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

  it('should replace fields in documents based on criteria', function () {
    var documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    var update = database.update('collection', {name: 'document'}, {replace: {name: 'new name'}});

    return update.then(function () {
      var expectedDocuments = [
        {id: '1', name: 'new name'},
        {id: '2', name: 'other document'},
        {id: '3', name: 'new name'}
      ];
      database.collections.collection.should.deep.equal(expectedDocuments);
    });
  });
});
