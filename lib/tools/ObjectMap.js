'use strict';

class ObjectMap {

  constructor() {
    this._innerMap = new Map();
  }

  set(key, value) {
    this._innerMap.set(JSON.stringify(key), value);
  }

  with(key, value) {
    this.set(key, value);
    return this;
  }

  get(key, defaultValue) {
    let result = this._innerMap.get(JSON.stringify(key));
    return result !== undefined ? result : defaultValue;
  }

  has(key) {
    return this._innerMap.has(JSON.stringify(key));
  }

  * entries() {
    let innerEntries = this._innerMap.entries();
    for (let entry of innerEntries) {
      yield [JSON.parse(entry[0]), entry[1]];
    }
  }

  * keys() {
    let innerKeys = this._innerMap.keys();
    for (let key of innerKeys) {
      yield JSON.parse(key);
    }
  }

  values() {
    return this._innerMap.values();
  }
}

module.exports = ObjectMap;
