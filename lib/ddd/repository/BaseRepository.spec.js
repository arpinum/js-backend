'use strict';

require('chai').use(require('chai-as-promised')).use(require('sinon-chai')).should();
var MemoryDatabase = require('../../test/MemoryDatabase');
var BaseRepository = require('./BaseRepository');
var EntityNotFoundError = require('../error/EntityNotFoundError');
var FunctionalError = require('../../tools/error/FunctionalError');

describe('The base repository', function () {
  var repository;
  var database;

  beforeEach(function () {
    database = new MemoryDatabase();
    repository = new BaseRepository(database, 'collection');
  });

  it('should find all entities based on criteria', function () {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    var findAll = repository.findAll({name: 'entity'});

    var expected = [
      {id: '1', name: 'entity'},
      {id: '3', name: 'entity'}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find an entity based on criteria', function () {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    var findFirst = repository.findFirst({name: 'entity'});

    return findFirst.should.eventually.deep.equal({id: '1', name: 'entity'});
  });

  it('should reject if no entity can be found when the first one is wanted', function () {
    var findFirst = repository.findFirst({name: 'entity'});

    return findFirst.should.be.rejectedWith(EntityNotFoundError);
  });

  it('should count the corresponding entities', function () {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    var count = repository.count({name: 'entity'});

    return count.should.eventually.equal(2);
  });

  it('should tell entity exists if at least one entity correspond to criteria', function () {
    database.collections.collection = [{id: '1', name: 'entity'}];

    var exist = repository.exist({name: 'entity'});

    return exist.should.eventually.be.true;
  });

  it('should tell no entity exist if no entity correspond to criteria', function () {
    database.collections.collection = [];

    var exist = repository.exist({name: 'entity'});

    return exist.should.eventually.be.false;
  });

  it('should add an entity', function () {
    var entity = {id: '3', name: 'entity'};

    var add = repository.add(entity);

    return add.then(function () {
      database.collections.collection.should.deep.equal([entity]);
    });
  });

  it('wont add an entity without id', function () {
    var entity = {name: 'entity'};

    var add = repository.add(entity);

    return add.should.be.rejectedWith(FunctionalError, 'Entity must have an id');
  });

  it('should update an entity', function () {
    database.collections.collection = [
      {id: '1', name: 'entity', unTouched: 'property'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    var update = repository.updateFirst({id: '1'}, {name: 'new entity'});

    return update.then(function () {
      var expected = [
        {id: '1', name: 'new entity', unTouched: 'property'},
        {id: '2', name: 'another entity'},
        {id: '3', name: 'entity'}
      ];
      database.collections.collection.should.deep.equal(expected);
    });
  });

  it('should delete an entity', function () {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    var deletion = repository.deleteFirst({id: '3'});

    return deletion.then(function () {
      var expected = [
        {id: '1', name: 'entity'},
        {id: '2', name: 'another entity'}
      ];
      database.collections.collection.should.deep.equal(expected);
    });
  });
});
