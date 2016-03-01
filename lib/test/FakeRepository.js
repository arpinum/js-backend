'use strict';

let Repository = require('../ddd/repository/Repository');

class FakeRepository extends Repository {
  constructor(database) {
    super(database, 'fakes');
  }
}

module.exports = FakeRepository;
