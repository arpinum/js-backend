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

  it('could be created with no data at all', () => {
    var event = new Event('tadaa');

    event.data.should.deep.equal({});
  });

  it('could concern an aggregate', () => {
    var event = new Event();

    event = event.concerningAggregate('MyAggregate');

    event.aggregate.should.equal('MyAggregate');
  });
});
