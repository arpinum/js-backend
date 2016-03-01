'use strict';

class SagaHandler {

  constructor(repositories, buses) {
    this._repositories = repositories;
    this._buses = buses;
  }
}

module.exports = SagaHandler;
