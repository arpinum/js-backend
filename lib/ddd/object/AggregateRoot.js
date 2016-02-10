'use strict';

let _ = require('lodash');
let FunctionalError = require('../../tools/error/FunctionalError');

class AggregateRoot {

  constructor(information) {
    if (!information || !information.id) {
      throw new FunctionalError('Entity must have an id');
    }
    _.assign(this, information);
  }

  pushEvent(event) {
    if (!this._events) {
      this._events = [];
    }
    let aggregateEvent = event.concerningAggregate(this);
    this._events.push(aggregateEvent);
  }

  flushEvents() {
    let events = this._events;
    delete this._events;
    return events || [];
  }
}

module.exports = AggregateRoot;
