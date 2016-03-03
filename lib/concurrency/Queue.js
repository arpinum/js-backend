'use strict';

let Bluebird = require('bluebird');
let _ = require('lodash');

class Queue {

  constructor(options) {
    this._options = _.defaults(options, {limit: 0});
    this._actions = [];
  }

  enqueue(action) {
    if (this._limitReached()) {
      return Bluebird.resolve();
    }
    return this._doEnqueue(action);
  }

  _limitReached() {
    return this._options.limit > 0 && this._actions.length >= this._options.limit;
  }

  _doEnqueue(action) {
    let deferredAction = this._deferredAction(action);
    this._actions.push(deferredAction.action);
    if (!this._active) {
      this._dequeue();
    }
    return deferredAction.promise;
  }

  _deferredAction(action) {
    let wrappedAction;
    let promise = new Bluebird((resolve, reject)=> {
      wrappedAction = () => {
        return Bluebird.try(action).then(resolve).catch(reject);
      };
    });
    return {
      action: wrappedAction,
      promise: promise
    };
  }

  _dequeue() {
    if (!_.isEmpty(this._actions)) {
      this._active = true;
      let action = this._actions.shift();
      action().finally(() => this._dequeue());
    } else {
      delete this._active;
      if (this._options.onEmpty) {
        this._options.onEmpty();
      }
    }
  }
}

module.exports = Queue;
