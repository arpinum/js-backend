'use strict';

let sinon = require('sinon');
let MemoryDatabase = require('../../test/MemoryDatabase');
let geolocation = require('../../tools/geolocation');
let Projection = require('./Projection');

describe('The projection', () => {

  let projection;
  let database;

  beforeEach(() => {
    database = new MemoryDatabase();
    database.findNear = sinon.stub().resolves();
    projection = new Projection(database, 'collection');
  });

  it('should find all documents based on criteria', () => {
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

  it('should find an document based on criteria', () => {
    database.collections.collection = [
      {id: '1', name: 'document'},
      {id: '2', name: 'another document'},
      {id: '3', name: 'document'}
    ];

    let findFirst = projection.findFirst({name: 'document'});

    return findFirst.should.eventually.deep.equal({id: '1', name: 'document'});
  });

  it('should find document near a geolocation', () => {
    let geolocation = {longitude: 1, latitude: 1};
    database.findNear
      .withArgs('collection', geolocation)
      .resolves([
        {distance: 12, document: {id: '1', name: 'Peppone'}},
        {distance: 33, document: {id: '2', name: 'The Scopitone'}}
      ]);

    let findNear = projection.findNear(geolocation);

    return findNear.should.eventually.deep.equal([
      {id: '1', name: 'Peppone', distance: 12},
      {id: '2', name: 'The Scopitone', distance: 33}
    ]);
  });

  it('should call the database with the right options when finding near a location', () => {
    let findNear = projection.findNear({longitude: 1, latitude: 1});

    return findNear.then(() => {
      let options = database.findNear.lastCall.args[2];
      options.spherical.should.be.true;
      options.distanceMultiplier.should.equal(geolocation.earthRadiusInMeters);
    });
  });
});
