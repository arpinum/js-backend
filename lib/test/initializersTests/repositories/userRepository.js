'use strict';

let BaseRepository = require('../../../ddd/repository/BaseRepository');

class UserRepository extends BaseRepository {
  constructor(database) {
    super(database, 'users');
  }
}

module.exports = UserRepository;
