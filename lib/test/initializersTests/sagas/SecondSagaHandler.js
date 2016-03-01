'use strict';

let SagaHandler = require('../../../ddd/saga/SagaHandler');

class SecondSagaHandler extends SagaHandler {

  constructor(repositories, buses) {
    super(repositories, buses);
  }

  onUserAddedEvent() {
  }
}

module.exports = SecondSagaHandler;
