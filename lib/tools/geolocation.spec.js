'use strict';

let geolocation = require('./geolocation');

describe('The geolocation', () => {

  it('should return earth radius in meters', () => {
    geolocation.earthRadiusInMeters.should.be.greaterThan(10);
  });

  it('should convert meters to radius', () => {
    geolocation.metersToRadius(10000).should.equal(10000 / geolocation.earthRadiusInMeters);
  });

  it('should convert rarius to meters', () => {
    geolocation.radiusToMeters(0.001).should.equal(0.001 * geolocation.earthRadiusInMeters);
  });
});
