'use strict';

require('chai').use(require('chai-as-promised')).use(require('sinon-chai')).should();
let MemoryDatabase = require('../../test/MemoryDatabase');
let Projection = require('./Projection');

describe('The projection', function () {
  let projection;
  let database;

  beforeEach(function () {
    database = new MemoryDatabase();
    projection = new Projection(database, 'collection');
  });

  it('should find all documents based on criteria', function () {
    database.collections.collection = [
      {id: '1', name: 'document'},
      {id: '2', name: 'another document'},
      {id: '3', name: 'document'}
    ];

    let findAll = projection.findAll({name: 'document'});

    let expected = [
      {id: '1', name: 'document'},
      {id: '3', name: 'document'}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find an document based on criteria', function () {
    database.collections.collection = [
      {id: '1', name: 'document'},
      {id: '2', name: 'another document'},
      {id: '3', name: 'document'}
    ];

    let findFirst = projection.findFirst({name: 'document'});

    return findFirst.should.eventually.deep.equal({id: '1', name: 'document'});
  });
});
