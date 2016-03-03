'use strict';

let geolocation = {
  earthRadiusInMeters: 6378100,
  metersToRadius: metersToRadius,
  radiusToMeters: radiusToMeters
};

function metersToRadius(meters) {
  return meters / geolocation.earthRadiusInMeters;
}

function radiusToMeters(radius) {
  return radius * geolocation.earthRadiusInMeters;
}

module.exports = geolocation;
