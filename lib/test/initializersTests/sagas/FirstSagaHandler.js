'use strict';

let SagaHandler = require('../../../ddd/saga/SagaHandler');

class FirstSagaHandler extends SagaHandler {

  constructor(repositories, buses) {
    super(repositories, buses);
  }

  onUserAddedEvent(event) {
    return this._repositories.userForSaga.save(event.data).then(() => {
      this._buses.event.broadcast(event);
    });
  }

  onUserDeletedEvent() {
  }

  thisIsNotAnEventYouKnow() {
  }
}

module.exports = FirstSagaHandler;
