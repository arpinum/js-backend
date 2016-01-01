'use strict';

module.exports = function taskQuery(queryProcessor) {
  return function (query) {
    return queryProcessor.findFirst('users', query);
  };
};
