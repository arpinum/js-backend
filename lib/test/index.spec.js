'use strict';

var should = require('chai').should();

describe('The index', function () {

  it('should provide some modules', function () {
    var modules = require('../../index');

    should.exist(modules);
  });
});
