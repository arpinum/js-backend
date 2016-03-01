'use strict';

let SagaHandler = require('../../../ddd/saga/SagaHandler');

class SecondSagaHandler extends SagaHandler {

  constructor(buses) {
    super(buses);
  }

  onUserAddedEvent() {
  }
}

module.exports = SecondSagaHandler;
