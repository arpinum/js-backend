'use strict';

class FirstUserProjection {

  constructor(database) {
    this.providedDatabase = database;
  }

  onUserAddedEvent() {
    this.bound = true;
  }

  onUserDeletedEvent() {
  }
}

module.exports = FirstUserProjection;
