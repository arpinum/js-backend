'use strict';

var util = require('util');
var QueryProcessor = require('../ddd/query/QueryProcessor');
var MemoryDatabase = require('./MemoryDatabase');

function MemoryQueryProcessor() {
  var database = new MemoryDatabase();
  QueryProcessor.call(this, database);

  this.collections = database.collections;
}

util.inherits(MemoryQueryProcessor, QueryProcessor);

module.exports = MemoryQueryProcessor;
