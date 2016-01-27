'use strict';

class Event {
  constructor(type, data) {
    this.date = new Date();
    this.type = type;
    this.data = data || {};
  }

  concerningAggregate(aggregate) {
    this.aggregate = {
      name: aggregate.constructor.name,
      id: aggregate.id
    };
    return this;
  }
}

module.exports = Event;
