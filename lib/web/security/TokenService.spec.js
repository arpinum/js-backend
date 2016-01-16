'use strict';

var should = require('chai').should();
var jwt = require('jsonwebtoken');
var TokenService = require('./TokenService');
var constants = require('../../test/constants');

describe('The token service', function () {
  var tokenService;

  beforeEach(function () {
    tokenService = new TokenService();
  });

  it('should create a token based on user', function () {
    var token = tokenService.create(constants.DECODED_JWT_TOKEN);

    token.should.match(constants.JWT_REGEX);
    var decoded = jwt.decode(token);
    decoded.id.should.equal(constants.USER_ID);
    should.exist(decoded.exp);
  });

  it('should verify successfully a valid token', function () {
    var token = tokenService.create(constants.DECODED_JWT_TOKEN);

    return tokenService.verify(token).should.eventually.deep.equal(constants.DECODED_JWT_TOKEN);
  });

  it('should verify with failure an invalid token', function () {
    return tokenService.verify('invalid').should.be.rejected;
  });
});
