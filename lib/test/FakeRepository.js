'use strict';

var util = require('util');
var BaseRepository = require('../ddd/repository/BaseRepository');

function FakeRepository(database) {
  BaseRepository.call(this, database, 'fakes');
}

util.inherits(FakeRepository, BaseRepository);

module.exports = FakeRepository;
