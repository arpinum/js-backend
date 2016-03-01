'use strict';

let Repository = require('../../../ddd/repository/Repository');

class UserRepository extends Repository {
  constructor(database) {
    super(database, 'users');
  }
}

module.exports = UserRepository;
