'use strict';

let should = require('chai').should();
let Event = require('./Event');

describe('An event', function () {

  it('should be created with current date', () => {
    var event = new Event();

    should.exist(event.date);
  });

  it('should be created with a type and some data', () => {
    var event = new Event('tadaa', {the: 'data'});

    event.type.should.equal('tadaa');
    event.data.should.deep.equal({the: 'data'});
  });

  it('should clone the data to avoid further modifications', () => {
    let data = {key: 'data'};

    let event = new Event('tadaa', data);

    data.key = 'modified data';
    event.data.key.should.equal('data');
  });

  it('could be created with no data at all', () => {
    var event = new Event('tadaa');

    event.data.should.deep.equal({});
  });

  it('could concern an aggregate', () => {
    var event = new Event();
    class MyAggregate {
      constructor(id) {
        this.id = id;
      }
    }
    var aggregate = new MyAggregate('4');

    event = event.concerningAggregate(aggregate);

    event.aggregate.should.deep.equal({name: 'MyAggregate', id: '4'});
  });
});
