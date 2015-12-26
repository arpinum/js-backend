'use strict';

var sinon = require('sinon');

function FakeResponse() {
  var self = this;
  self.send = sinon.stub().returnsThis();
  self.end = sinon.stub().returnsThis();
  self.status = sinon.stub().returnsThis();
  self.cookie = sinon.stub().returnsThis();
  self.clearCookie = sinon.stub().returnsThis();
}

module.exports = FakeResponse;
