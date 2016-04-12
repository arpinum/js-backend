'use strict';

module.exports = buses => {

  return event => {
    buses.event.broadcast(event);
  };
};
