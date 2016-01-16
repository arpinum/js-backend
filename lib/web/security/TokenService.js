'use strict';

var _ = require('lodash');
var jwt = require('jsonwebtoken');
var Bluebird = require('bluebird');
var jwtVerify = Bluebird.promisify(jwt.verify);

function TokenService(options) {
  var $options = parseOptions(options);

  var self = this;
  self.create = create;
  self.verify = verify;

  function create(user) {
    var payload = {
      id: user.id
    };
    var options = {
      algorithm: 'HS256',
      expiresIn: $options.expirationInMinutes + 'm'
    };
    return jwt.sign(payload, $options.secret, options);
  }

  function verify(jeton) {
    var options = {
      algorithm: 'HS256'
    };
    return jwtVerify(jeton, $options.secret, options).then(function (payload) {
      return {id: payload.id};
    });
  }

  function parseOptions(options) {
    return _.defaults(options || {}, {
      expirationInMinutes: '10080',
      secret: 'jwtSecret'
    });
  }
}

module.exports = TokenService;
