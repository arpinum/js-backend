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
      email: user.email
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
      return {email: payload.email};
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
