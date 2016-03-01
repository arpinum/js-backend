'use strict';

require('chai').use(require('chai-as-promised')).use(require('sinon-chai')).should();
let MemoryDatabase = require('../../test/MemoryDatabase');
let AggregateRoot = require('../object/AggregateRoot');
let Repository = require('./Repository');
let EntityNotFoundError = require('../error/EntityNotFoundError');
let FunctionalError = require('../../tools/error/FunctionalError');

describe('The repository', () => {
  let repository;
  let database;

  class MyRoot extends AggregateRoot {
    constructor(information) {
      super(information);
    }
  }

  class MyRootWithKeys extends AggregateRoot {
    constructor(information) {
      super(information);
    }

    static get relevantKeys() {
      return [
        'id',
        'reservationFees'
      ];
    }
  }

  beforeEach(() => {
    database = new MemoryDatabase();
    repository = new Repository(database, 'collection');
  });

  it('should find all entities based on criteria', () => {
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

  it('should find all entities converted to specific entity type', () => {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'}
    ];
    repository.toEntity = object => new MyRoot(object);

    let findAll = repository.findAll();

    let expected = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'}
    ];
    return findAll.then(entities => {
      entities.should.deep.equal(expected);
      entities[0].should.be.instanceOf(MyRoot);
      entities[1].should.be.instanceOf(MyRoot);
    });
  });

  it('should find an entity based on criteria', () => {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    let findFirst = repository.findFirst({name: 'entity'});

    return findFirst.should.eventually.deep.equal({id: '1', name: 'entity'});
  });

  it('should find an entity converted to specific entity type', () => {
    database.collections.collection = [{id: '1', name: 'entity'}];
    repository.toEntity = object => new MyRoot(object);

    let findFirst = repository.findFirst({name: 'entity'});

    return findFirst.then(entity => {
      entity.should.deep.equal({id: '1', name: 'entity'});
      entity.should.be.instanceOf(MyRoot);
    });
  });

  it('should reject if no entity can be found when the first one is wanted', () => {
    let findFirst = repository.findFirst({name: 'entity'});

    return findFirst.should.be.rejectedWith(EntityNotFoundError);
  });

  it('should count the corresponding entities', () => {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    let count = repository.count({name: 'entity'});

    return count.should.eventually.equal(2);
  });

  it('should tell entity exists if at least one entity correspond to criteria', () => {
    database.collections.collection = [{id: '1', name: 'entity'}];

    let exist = repository.exist({name: 'entity'});

    return exist.should.eventually.be.true;
  });

  it('should tell no entity exist if no entity correspond to criteria', () => {
    database.collections.collection = [];

    let exist = repository.exist({name: 'entity'});

    return exist.should.eventually.be.false;
  });

  it('should save a new entity', () => {
    let entity = {id: '3', name: 'entity'};

    let add = repository.save(entity);

    return add.then(() => {
      database.collections.collection.should.deep.equal([entity]);
    });
  });

  it('wont save irrelevant keys if specified', () => {
    let entity = new MyRootWithKeys({id: '3'});
    entity.irrelevant = 'no thx';

    let add = repository.save(entity);

    return add.then(() => {
      database.collections.collection.should.deep.equal([{id: '3'}]);
    });
  });

  it('should save irrelevant keys if no specified', () => {
    let entity = new MyRoot({id: '3'});
    entity.irrelevant = 'no thx';

    let add = repository.save(entity);

    return add.then(() => {
      database.collections.collection.should.deep.equal([{id: '3', irrelevant: 'no thx'}]);
    });
  });

  it('wont add an entity without id', () => {
    let entity = {name: 'entity'};

    let add = repository.save(entity);

    return add.should.be.rejectedWith(FunctionalError, 'Entity must have an id');
  });

  it('should save an existing entity', () => {
    database.collections.collection = [{id: '3', name: 'old name'}];

    let add = repository.save({id: '3', name: 'new name'});

    return add.then(() => {
      database.collections.collection.should.deep.equal([{id: '3', name: 'new name'}]);
    });
  });

  it('should delete an entity', () => {
    database.collections.collection = [
      {id: '1', name: 'entity'},
      {id: '2', name: 'another entity'},
      {id: '3', name: 'entity'}
    ];

    let deletion = repository.deleteFirst({id: '3'});

    return deletion.then(() => {
      let expected = [
        {id: '1', name: 'entity'},
        {id: '2', name: 'another entity'}
      ];
      database.collections.collection.should.deep.equal(expected);
    });
  });
});
