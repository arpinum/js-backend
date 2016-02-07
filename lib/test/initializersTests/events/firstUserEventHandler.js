'use strict';

module.exports = buses => {
  return {
    onUserAddedEvent: event => {
      buses.event.broadcast(event);
    },
    onUserDeletedEvent: () => {
    },
    thisIsNotAnEventYouKnow: {}
  };
};
