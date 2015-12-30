'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var QueryProcessor = require('./QueryProcessor');
var MemoryDatabase = require('../../test/MemoryDatabase');
var QueriedObjectNotFoundError = require('./QueriedObjectNotFoundError');

describe('The query processor', function () {

  var database;
  var processor;

  beforeEach(function () {
    database = new MemoryDatabase();
    processor = new QueryProcessor(database);
  });

  it('should find all documents', function () {
    database.collections.collection = [{id: 1, name: 'object'}];

    var findAll = processor.findAll('collection');

    return findAll.should.eventually.deep.equal([{id: 1, name: 'object'}]);
  });

  it('should count documents', function () {
    database.collections.collection = [{id: 1, name: 'object'}];

    var count = processor.count('collection');

    return count.should.eventually.equal(1);
  });

  it('should find first document based on criteria', function () {
    database.collections.collection = [{id: '1', name: 'document'}];

    var findFirst = processor.findFirst('collection', {name: 'document'});

    return findFirst.should.eventually.deep.equal({id: '1', name: 'document'});
  });

  it('should reject if cannot find first based on criteria', function () {
    database.collections.collection = [];

    var findFirst = processor.findFirst('collection', {name: 'document'});

    return findFirst.should.be.rejectedWith(QueriedObjectNotFoundError);
  });
});
