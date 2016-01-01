'use strict';

var _ = require('lodash');
var path = require('path');
var ResourceInitializer = require('./ResourceInitializer');

describe('The resource initializer', function () {

  var resources;
  var buses;

  beforeEach(function () {
    buses = {fake: 'buses'};
    var rootDirectory = path.resolve(__dirname, '../../test/initializersTests/resources');
    var initializer = new ResourceInitializer(buses, {rootDirectory: rootDirectory});
    return initializer.initialize().then(function (r) {
      resources = r;
    });
  });

  it('should find all repositories', function () {
    _.keys(resources).should.deep.equal(['user', 'veryLast']);
  });

  it('should initialize fully working resources', function () {
    resources.user.buses.should.equal(buses);
  });
});
