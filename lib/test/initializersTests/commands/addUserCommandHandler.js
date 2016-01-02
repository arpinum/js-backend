'use strict';

module.exports = function (repositories, buses) {
  return function (command) {
    return repositories.user.add(command).then(function () {
      buses.type.broadcast('userAdddEvent', command);
    });
  };
};
