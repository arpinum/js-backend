'use strict';

var Bluebird = require('bluebird');
var bcrypt = Bluebird.promisifyAll(require('bcrypt'));

function PasswordService() {
  var BCRYPT_REGEX = /.{60}/;

  this.compare = compare;
  this.encrypt = encrypt;
  this.encrypted = encrypted;

  function compare(encrypt, plainText) {
    return bcrypt.compareAsync(encrypt, plainText);
  }

  function encrypt(plainText) {
    return bcrypt.genSaltAsync().then(function (salt) {
      return bcrypt.hashAsync(plainText || '', salt);
    });
  }

  function encrypted(password) {
    return BCRYPT_REGEX.test(password);
  }
}

module.exports = PasswordService;
