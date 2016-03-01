'use strict';

let SagaHandler = require('../../../ddd/saga/SagaHandler');

class FirstSagaHandler extends SagaHandler {

  constructor(buses) {
    super(buses);
  }

  onUserAddedEvent(event) {
    this._buses.event.broadcast(event);
  }

  onUserDeletedEvent() {
  }

  thisIsNotAnEventYouKnow() {
  }
}

module.exports = FirstSagaHandler;
