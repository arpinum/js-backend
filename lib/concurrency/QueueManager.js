'use strict';

let _ = require('lodash');
let Queue = require('./Queue');

class QueueManager {

  constructor() {
    this._queues = new Map();
  }

  queue(id, options) {
    if (!this._queues.has(id)) {
      this._createQueue(id, options);
    }
    return this._queues.get(id);
  }

  _createQueue(id, options) {
    let queueOptions = _.assign({
      onEmpty: () => {
        this._queueEmpty(id);
      }
    }, options);
    this._queues.set(id, new Queue(queueOptions));
  }

  _queueEmpty(id) {
    this._queues.delete(id);
  }
}

module.exports = QueueManager;
