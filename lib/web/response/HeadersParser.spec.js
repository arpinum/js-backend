'use strict';

let should = require('chai').should();
let HeadersParser = require('./HeadersParser');

describe('The headers parser', () => {

  it('should get specific header', () => {
    var headersParser = new HeadersParser({header: 'value'});

    headersParser.get('header').should.equal('value');
  });

  it('should get null if no specific header', () => {
    var headersParser = new HeadersParser({header: 'value'});

    should.not.exist(headersParser.get());
  });

  it('should get null if header cannot be found', () => {
    var headersParser = new HeadersParser({header: 'value'});

    should.not.exist(headersParser.get('unknown'));
  });

  it('should get null if there are no headers', () => {
    var headersParser = new HeadersParser(null);

    should.not.exist(headersParser.get('unknown'));
  });

  it('should get specific header without case sensitivity', () => {
    var headersParser = new HeadersParser({'x-header': 'value'});

    headersParser.get('X-Header').should.equal('value');
  });
});
