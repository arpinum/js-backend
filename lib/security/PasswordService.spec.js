'use strict';

var PasswordService = require('./PasswordService');
var constants = require('../test/constants');

describe('The password service', function () {
  var service;

  beforeEach(function () {
    service = new PasswordService();
  });

  it('should compare successfully two corresponding passwords', function () {

    return service.compare(constants.PASSWORD, constants.PASSWORD_IN_BCRYPT).should.eventually.be.true;
  });

  it('should compare with failure if passwords do not correspond', function () {
    return service.compare('bleh', constants.PASSWORD_IN_BCRYPT).should.eventually.be.false;
  });

  it('should encrypt passwords', function () {
    return service.encrypt(constants.PASSWORD).should.eventually.match(constants.BCRYPT_REGEX);
  });

  it('should encrypt a password though it is empty', function () {
    return service.encrypt().should.eventually.match(constants.BCRYPT_REGEX);
  });

  it('should tell if a password is encrypted', function () {
    service.encrypted(constants.PASSWORD_IN_BCRYPT).should.be.true;
    service.encrypted('bleh').should.be.false;
  });
});
