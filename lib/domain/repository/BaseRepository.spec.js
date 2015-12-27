'use strict';

var should = require('chai').use(require('chai-as-promised')).use(require('sinon-chai')).should();
var Bluebird = require('bluebird');
var sinon = require('sinon');
var BaseRepository = require('./BaseRepository');
var EntityNotFoundError = require('../errors/EntityNotFoundError');
var constants = require('../../test/constants');

describe('The base repository', function () {
  var database;
  var baseRepository;
  var currentDate;

  beforeEach(function () {
    database = {
      findAll: sinon.stub().returns(Bluebird.resolve([])),
      findFirst: sinon.stub().returns(Bluebird.resolve({})),
      count: sinon.stub().returns(Bluebird.resolve(0)),
      add: sinon.stub().returns(Bluebird.resolve([])),
      update: sinon.stub().returns(Bluebird.resolve([]))
    };
    currentDate = new Date();
    baseRepository = new BaseRepository(
      database,
      'my collection', {
        currentDateFunction: function () {
          return currentDate;
        }
      });
  });

  it('should find all entities', function () {
    var entities = [{id: '1', prop: 'first'}, {id: '2', prop: 'second'}];
    database
      .findAll
      .withArgs('my collection', {deletion_date: null})
      .returns(Bluebird.resolve(entities));

    var expected = [{id: '1', prop: 'first'}, {id: '2', prop: 'second'}];
    return baseRepository.findAll().should.eventually.eql(expected);
  });

  it('should find an entity based on criteria', function () {
    var entity = {id: '1', prop: 'first'};
    database
      .findFirst
      .withArgs('my collection', {id: '1', deletion_date: null})
      .returns(Bluebird.resolve(entity));

    return baseRepository.findFirst({id: '1'}).should.eventually.eql({id: '1', prop: 'first'});
  });

  it('should count the corresponding entities', function () {
    database
      .count
      .withArgs('my collection', {prop: 'value', deletion_date: null})
      .returns(Bluebird.resolve(42));

    return baseRepository.count({prop: 'value'}).should.eventually.eql(42);
  });

  it('should tell entity exists if at least one entity correspond to criteria', function () {
    database
      .count
      .withArgs('my collection', {prop: 'value', deletion_date: null})
      .returns(Bluebird.resolve(42));

    return baseRepository.exist({prop: 'value'}).should.eventually.be.true;
  });

  it('should tell no entity exist if no entity correspond to criteria', function () {
    database
      .count
      .withArgs('my collection', {prop: 'value', deletion_date: null})
      .returns(Bluebird.resolve(0));

    return baseRepository.exist({prop: 'value'}).should.eventually.be.false;
  });

  it('should reject if no entity can be found when the first one is wanted', function () {
    database
      .findFirst
      .returns(Bluebird.resolve(null));

    return baseRepository.findFirst({id: '1'})
      .should.be.rejectedWith(EntityNotFoundError, 'No entity for ' + JSON.stringify({id: '1'}));
  });

  it('should find all entities corresponding to criteria', function () {
    var entity = {id: '1', prop: 'value', otherProp: 'other value'};
    database
      .findAll
      .withArgs('my collection', {prop: 'value', otherProp: 'other value', deletion_date: null})
      .returns(Bluebird.resolve([entity]));

    var promise = baseRepository.findAll({prop: 'value', otherProp: 'other value'});

    return promise.should.eventually.eql([{id: '1', prop: 'value', otherProp: 'other value'}]);
  });

  it('should add an entity while defining its identifier', function () {
    var entity = {nom: 'entity'};

    return baseRepository.add(entity).then(function (result) {
      var args = database.add.firstCall.args;
      args[0].should.equal('my collection');
      args[1].id.should.match(constants.UUID_REGEX);
      args[1].nom.should.equal('entity');
      should.exist(result.id);
      result.id.should.match(constants.UUID_REGEX);
    });
  });

  it('should set creation and update date while adding entity', function () {
    var entity = {nom: 'entity'};

    return baseRepository.add(entity).then(function () {
      var args = database.add.firstCall.args;
      args[1].creation_date.should.equal(currentDate);
      args[1].update_date.should.equal(currentDate);
    });
  });

  it('should partially modify an entity', function () {
    var entity = {id: '1', prop: 'new value', otherProp: 'other value'};

    return baseRepository.updatePartially(entity).then(function () {
      var args = database.update.firstCall.args;
      args[0].should.equal('my collection');
      args[1].should.deep.equal({id: '1'});
      args[2].should.include.key('replace');
      should.not.exist(args[2].replace.id);
      args[2].replace.prop.should.deep.equal('new value');
      args[2].replace.otherProp.should.deep.equal('other value');
    });
  });

  it('should update the update date while modifying an entity', function () {
    var entity = {id: '1', nom: 'modified'};

    return baseRepository.updatePartially(entity).then(function () {
      var args = database.update.firstCall.args;
      args[2].replace.should.include.key('update_date');
      args[2].replace.update_date.should.equal(currentDate);
    });
  });

  it('should set deletion and update dates while deleting an entity', function () {
    return baseRepository.delete({id: '1'}).then(function () {
      var args = database.update.firstCall.args;
      args[0].should.equal('my collection');
      args[1].should.deep.equal({id: '1'});
      args[2].replace.deletion_date.should.equal(currentDate);
      args[2].replace.update_date.should.equal(currentDate);
    });
  });
});
