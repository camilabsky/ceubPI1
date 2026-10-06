const test = require('node:test');
const assert = require('node:assert/strict');
const { distanceInMeters, isValidCoordinate } = require('./geolocation');

test('valida coordenadas dentro dos limites geográficos', () => {
  assert.equal(isValidCoordinate(-15.78, -47.93), true);
  assert.equal(isValidCoordinate(91, 0), false);
  assert.equal(isValidCoordinate(-15.78, Number.NaN), false);
});

test('calcula distância geográfica em metros', () => {
  assert.equal(distanceInMeters(-15.78, -47.93, -15.78, -47.93), 0);
  const approx100Meters = distanceInMeters(-15.78, -47.93, -15.7791, -47.93);
  assert.ok(approx100Meters > 90 && approx100Meters < 110);
  assert.equal(distanceInMeters(-15.78, -47.93, Number.NaN, -47.93), null);
});
