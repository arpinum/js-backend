'use strict';

class AggregateRoot {
  constructor(id) {
    this.id = id;
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
