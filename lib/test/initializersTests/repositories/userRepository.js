'use strict';

var util = require('util');
var BaseRepository = require('../../../ddd/repository/BaseRepository');

function UserRepository(database) {
  BaseRepository.call(this, database, 'users');
}

util.inherits(UserRepository, BaseRepository);

module.exports = UserRepository;
