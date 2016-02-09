'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
let MemoryDatabase = require('./MemoryDatabase');

describe('The memory database', () => {
  let database;

  beforeEach(() => {
    database = new MemoryDatabase();
  });

  it('should find all documents for the given collection', () => {
    let documents = [
      {name: 'first document'},
      {name: 'second document'}
    ];
    database.collections.collection = documents;

    let findAll = database.findAll('collection');

    return findAll.should.eventually.deep.equal(documents);
  });

  it('wont find document in the wrong collection', () => {
    database.collections.collection = [{name: 'first document'}];

    let findAll = database.findAll('wrong collection');

    return findAll.should.eventually.deep.equal([]);
  });

  it('should find all documents based on criteria', () => {
    let documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    let findAll = database.findAll('collection', {name: 'document'});

    let expected = [
      {id: '1', name: 'document'},
      {id: '3', name: 'document'}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents matching array element in criteria', () => {
    let documents = [
      {id: '1', letters: ['a', 'b', 'c']},
      {id: '2', letters: ['z']},
      {id: '3', letters: ['a', 'c']}
    ];
    database.collections.collection = documents;

    let findAll = database.findAll('collection', {letters: 'c'});

    let expected = [
      {id: '1', letters: ['a', 'b', 'c']},
      {id: '3', letters: ['a', 'c']}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents matching complete array in criteria', () => {
    let documents = [
      {id: '1', letters: ['a', 'b', 'c']},
      {id: '2', letters: ['z']},
      {id: '3', letters: ['a', 'c']}
    ];
    database.collections.collection = documents;

    let findAll = database.findAll('collection', {letters: ['a', 'c']});

    let expected = [
      {id: '3', letters: ['a', 'c']}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents based on deep criteria', () => {
    let documents = [
      {id: '1', property: {deep: 'right'}},
      {id: '2', property: {deep: 'wrong'}},
      {id: '3', property: {deep: 'right'}},
      {id: '4'}
    ];
    database.collections.collection = documents;

    let findAll = database.findAll('collection', {property: {deep: 'right'}});

    let expected = [
      {id: '1', property: {deep: 'right'}},
      {id: '3', property: {deep: 'right'}}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents with ascending order', () => {
    let documents = [
      {id: '1', name: 'a'},
      {id: '2', name: 'c'},
      {id: '3', name: 'b'}
    ];
    database.collections.collection = documents;

    let findAll = database.findAll('collection', {}, {orderBy: {key: 'name', order: 'asc'}});

    let expected = [
      {id: '1', name: 'a'},
      {id: '3', name: 'b'},
      {id: '2', name: 'c'}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents with descending order', () => {
    let documents = [
      {id: '1', name: 'a'},
      {id: '2', name: 'c'},
      {id: '3', name: 'b'}
    ];
    database.collections.collection = documents;

    let findAll = database.findAll('collection', {}, {orderBy: {key: 'name', order: 'desc'}});

    let expected = [
      {id: '2', name: 'c'},
      {id: '3', name: 'b'},
      {id: '1', name: 'a'}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all documents based on criteria though some are null', () => {
    let documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document', date: 'today'}
    ];
    database.collections.collection = documents;

    let findAll = database.findAll('collection', {name: 'document', date: null});

    return findAll.should.eventually.deep.equal([{id: '1', name: 'document'}]);
  });

  it('should find first document based on criteria', () => {
    let documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    let findFirst = database.findFirst('collection', {name: 'document'});

    return findFirst.should.eventually.deep.equal({id: '1', name: 'document'});
  });

  it('should count documents based on criteria', () => {
    let documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    let count = database.count('collection', {name: 'document'});

    return count.should.eventually.equal(2);
  });

  it('should add document', () => {
    let add = database.add('collection', {name: 'document'});

    return add.then(() => {
      database.collections.collection.should.deep.equal([{name: 'document'}]);
    });
  });

  it('should replace fields in first document matching criteria', () => {
    let documents = [
      {id: '1', name: 'document', other: 'field'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    let update = database.updateFirst('collection', {name: 'document'}, {$set: {name: 'new name'}});

    return update.then(() => {
      let expectedDocuments = [
        {id: '1', name: 'new name', other: 'field'},
        {id: '2', name: 'other document'},
        {id: '3', name: 'document'}
      ];
      database.collections.collection.should.deep.equal(expectedDocuments);
    });
  });

  it('should push values in first document matching criteria', () => {
    let documents = [
      {id: '1', numbers: [{value: '1'}]},
      {id: '2', numbers: [{value: '1'}]},
      {id: '3', numbers: [{value: '1'}]}
    ];
    database.collections.collection = documents;

    let update = database.updateFirst('collection', {id: '1'}, {$push: {numbers: {value: '2'}}});

    return update.then(() => {
      let expectedDocuments = [
        {id: '1', numbers: [{value: '1'}, {value: '2'}]},
        {id: '2', numbers: [{value: '1'}]},
        {id: '3', numbers: [{value: '1'}]}
      ];
      database.collections.collection.should.deep.equal(expectedDocuments);
    });
  });

  it('should pull values in first document matching criteria', () => {
    let documents = [
      {id: '1', numbers: [{value: '1'}, {value: '2'}]},
      {id: '2', numbers: [{value: '1'}]},
      {id: '3', numbers: [{value: '1'}]}
    ];
    database.collections.collection = documents;

    let update = database.updateFirst('collection', {id: '1'}, {$pull: {numbers: {value: '2'}}});

    return update.then(() => {
      let expectedDocuments = [
        {id: '1', numbers: [{value: '1'}]},
        {id: '2', numbers: [{value: '1'}]},
        {id: '3', numbers: [{value: '1'}]}
      ];
      database.collections.collection.should.deep.equal(expectedDocuments);
    });
  });

  it('should replace first document matching criteria', () => {
    let documents = [
      {id: '1', name: 'document', other: 'field'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    let update = database.replaceFirst('collection', {name: 'document'}, {id: '1', name: 'new name'});

    return update.then(() => {
      let expectedDocuments = [
        {id: '1', name: 'new name'},
        {id: '2', name: 'other document'},
        {id: '3', name: 'document'}
      ];
      database.collections.collection.should.deep.equal(expectedDocuments);
    });
  });

  it('wont insert inexisting document on replace by default', () => {
    database.collections.collection = [];

    let update = database.replaceFirst('collection', {name: 'document'}, {id: '1', name: 'new name'});

    return update.then(() => {
      database.collections.collection.should.deep.equal([]);
    });
  });

  it('should insert inexisting document on replace if specified', () => {
    database.collections.collection = [];

    let update = database.replaceFirst('collection', {name: 'document'}, {id: '1', name: 'new name'}, {upsert: true});

    return update.then(() => {
      database.collections.collection.should.deep.equal([{id: '1', name: 'new name'}]);
    });
  });

  it('should delete first document matching criteria', () => {
    let documents = [
      {id: '1', name: 'document'},
      {id: '2', name: 'other document'},
      {id: '3', name: 'document'}
    ];
    database.collections.collection = documents;

    let deletion = database.deleteFirst('collection', {name: 'document'});

    return deletion.then(() => {
      let expectedDocuments = [
        {id: '2', name: 'other document'},
        {id: '3', name: 'document'}
      ];
      database.collections.collection.should.deep.equal(expectedDocuments);
    });
  });
});
