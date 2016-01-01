'use strict';

var _ = require('lodash');
var path = require('path');
var MemoryDatabase = require('../../test/MemoryDatabase');
var RepositoryInitializer = require('./RepositoryInitializer');

describe('The repository initializer', function () {

  var repositories;
  var database;

  beforeEach(function () {
    database = new MemoryDatabase();
    var rootDirectory = path.resolve(__dirname, '../../test/initializersTests/repositories');
    var initializer = new RepositoryInitializer(database, {rootDirectory: rootDirectory});
    return initializer.initialize().then(function (r) {
      repositories = r;
    });
  });

  it('should find all repositories', function () {
    _.keys(repositories).should.deep.equal(['user', 'veryLast']);
  });

  it('should initialize fully working repositories', function () {
    database.collections.users = [{id: '1', email: 'email'}];

    return repositories.user.findAll().should.eventually.deep.equal([{id: '1', email: 'email'}]);
  });
});
