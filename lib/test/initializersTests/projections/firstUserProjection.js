'use strict';

function FirstUserProjection(database) {
  this.providedDatabase = database;
  this.onUserAddedEvent = function () {
  };
  this.onUserDeletedEvent = function () {
  };
}

module.exports = FirstUserProjection;
