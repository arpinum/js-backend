'use strict';

let BaseRepository = require('../ddd/repository/BaseRepository');

class FakeRepository extends BaseRepository {
  constructor(database) {
    super(database, 'fakes');
  }
}

module.exports = FakeRepository;
