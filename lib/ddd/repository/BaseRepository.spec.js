'use strict';

require('chai').use(require('chai-as-promised')).use(require('sinon-chai')).should();
let _ = require('lodash');
let MemoryDatabase = require('../../test/MemoryDatabase');
let BaseRepository = require('./BaseRepository');
let EntityNotFoundError = require('../error/EntityNotFoundError');
let FunctionalError = require('../../tools/error/FunctionalError');

describe('The base repository', function () {
  let repository;
  let database;

  class MyEntity {
    constructor(object) {
      _.merge(this, object);
    }
  }

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

    let findAll = repository.findAll({name: 'entity'});

    let expected = [
      {id: '1', name: 'entity'},
      {id: '3', name: 'entity'}
    ];
    return findAll.should.eventually.deep.equal(expected);
  });

  it('should find all entities converted to specific entity type', function () {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'}
    ];
    repository.toEntity = object => new MyEntity(object);

    let findAll = repository.findAll();

    let expected = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'}
    ];
    return findAll.then(entities => {
      entities.should.deep.equal(expected);
      entities[0].should.be.instanceOf(MyEntity);
      entities[1].should.be.instanceOf(MyEntity);
    });
  });

  it('should find an entity based on criteria', function () {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    let findFirst = repository.findFirst({name: 'entity'});

    return findFirst.should.eventually.deep.equal({id: '1', name: 'entity'});
  });

  it('should find an entity converted to specific entity type', function () {
    database.collections.collection = [{id: '1', name: 'entity'}];
    repository.toEntity = object => new MyEntity(object);

    let findFirst = repository.findFirst({name: 'entity'});

    return findFirst.then(entity => {
      entity.should.deep.equal({id: '1', name: 'entity'});
      entity.should.be.instanceOf(MyEntity);
    });
  });

  it('should reject if no entity can be found when the first one is wanted', function () {
    let findFirst = repository.findFirst({name: 'entity'});

    return findFirst.should.be.rejectedWith(EntityNotFoundError);
  });

  it('should count the corresponding entities', function () {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    let count = repository.count({name: 'entity'});

    return count.should.eventually.equal(2);
  });

  it('should tell entity exists if at least one entity correspond to criteria', function () {
    database.collections.collection = [{id: '1', name: 'entity'}];

    let exist = repository.exist({name: 'entity'});

    return exist.should.eventually.be.true;
  });

  it('should tell no entity exist if no entity correspond to criteria', function () {
    database.collections.collection = [];

    let exist = repository.exist({name: 'entity'});

    return exist.should.eventually.be.false;
  });

  it('should add an entity', function () {
    let entity = {id: '3', name: 'entity'};

    let add = repository.add(entity);

    return add.then(function () {
      database.collections.collection.should.deep.equal([entity]);
    });
  });

  it('wont add an entity without id', function () {
    let entity = {name: 'entity'};

    let add = repository.add(entity);

    return add.should.be.rejectedWith(FunctionalError, 'Entity must have an id');
  });

  it('should update an entity', function () {
    database.collections.collection = [
      {id: '1', name: 'entity', unTouched: 'property'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    let update = repository.updateFirst({id: '1'}, {name: 'new entity'});

    return update.then(function () {
      let expected = [
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

    let deletion = repository.deleteFirst({id: '3'});

    return deletion.then(function () {
      let expected = [
        {id: '1', name: 'entity'},
        {id: '2', name: 'another entity'}
      ];
      database.collections.collection.should.deep.equal(expected);
    });
  });
});
