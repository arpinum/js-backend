'use strict';

let _ = require('lodash');

class Event {

  constructor(type, data) {
    this.date = new Date();
    this.type = type;
    this.data = _.clone(data) || {};
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
