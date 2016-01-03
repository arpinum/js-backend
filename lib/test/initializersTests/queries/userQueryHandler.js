'use strict';

module.exports = function (projections) {
  return function (query) {
    return projections.user.findFirst(query);
  };
};
