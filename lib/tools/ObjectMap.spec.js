'use strict';

let ObjectMap = require('./ObjectMap');

describe('The object map', () => {

  let map;

  beforeEach(() => {
    map = new ObjectMap();
  });

  it('should set and get value indexed by an object', () => {
    map.set({hello: 'world'}, 'the value');

    let value = map.get({hello: 'world'});

    value.should.equal('the value');
  });

  it('should set value fluently', () => {
    map
      .with('key1', 'value1')
      .with('key2', 'value2');

    map.get('key1').should.equal('value1');
    map.get('key2').should.equal('value2');
  });

  it('should return default value if key not found', () => {
    let value = map.get('key not found', 'the value');

    value.should.equal('the value');
  });

  it('should say if has key', () => {
    map.set('key', 'value');
    map.set({the: 'key'}, 'value');

    map.has('key').should.be.true;
    map.has({the: 'key'}).should.be.true;
    map.has('key not found').should.be.false;
    map.has({not: 'found'}).should.be.false;
  });

  it('should delete entry from key', () => {
    map.set('key', 'not deleted');
    map.set({willbe: 'deleted'}, 'the value');

    map.delete({willbe: 'deleted'});

    map.has({willbe: 'deleted'}).should.be.false;
    map.has('key').should.be.true;
  });

  it('should delete entry fluently from key', () => {
    map.set('key1', 'value1');
    map.set('key2', 'value2');

    map.without('key1').without('key2');

    map.has('key1').should.be.false;
    map.has('key2').should.be.false;
  });

  it('should return iterator for keys', () => {
    map
      .with('key', 'first value')
      .with({the: 'other key'}, 'second value');

    let keys = Array.from(map.keys());

    keys.should.deep.equal(['key', {the: 'other key'}]);
  });

  it('should return iterator for values', () => {
    map
      .with('key', 'first value')
      .with({the: 'other key'}, 'second value');

    let values = Array.from(map.values());

    values.should.deep.equal(['first value', 'second value']);
  });

  it('should return iterator for entries', () => {
    map
      .with('key1', 'value1')
      .with('key2', 'value2');

    let entries = Array.from(map.entries());

    entries.should.deep.equal([['key1', 'value1'], ['key2', 'value2']]);
  });
});
