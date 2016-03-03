'use strict';

let _ = require('lodash');
let Queue = require('./Queue');

class QueueManager {

  constructor(options) {
    this._options = _.defaults(options, {});
    this._queues = new Map();
  }

  queue(id) {
    if (!this._queues.has(id)) {
      this._createQueue(id);
    }
    return this._queues.get(id);
  }

  _createQueue(id) {
    let queueOptions = _.assign({
      onEmpty: () => {
        this._queueEmpty(id);
      }
    }, this._options);
    this._queues.set(id, new Queue(queueOptions));
  }

  _queueEmpty(id) {
    this._queues.delete(id);
  }
}

module.exports = QueueManager;
