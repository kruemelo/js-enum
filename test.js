// $ mocha
var path = require('path');
var assert = require('assert');
var util = require('util');
var requirejs = require('requirejs');

var Enum = requirejs('enum.js');

describe('enum', function () {

  it('should create an enumeration from string array', function () {

    var enumeration = Enum.create([
      'LOADED', 'STARTED', 'RESUMED', 'PAUSED', 'STOPPED', 'DESTROYED'
    ]);

    assert.deepEqual(
      enumeration,
      { LOADED: 1,
        STARTED: 2,
        RESUMED: 4,
        PAUSED: 8,
        STOPPED: 16,
        DESTROYED: 32
      }
    );

  });

  it('should create an enumeration from object', function () {

    var enumeration = Enum.create({
      LOADED: 10,
      STARTED: 20,
      RESUMED: 21,
      PAUSED: 30,
      STOPPED: 31,
      DESTROYED: 32,
      STRVAL: 'string value'
    });

    assert.deepEqual(
      enumeration,
      { LOADED: 10,
        STARTED: 20,
        RESUMED: 21,
        PAUSED: 30,
        STOPPED: 31,
        DESTROYED: 32,
        STRVAL: 'string value'
      }
    );

  });

  it('should be possible to enumerate enumeration elements', function () {

    var enumeration = Enum.create(['ONE', 'TWO', 'THREE']),
      index = 0,
      expected = ['ONE', 'TWO', 'THREE'];

    for (var el in enumeration) {
      assert.equal(el, expected[index++]);
    }

    assert.deepEqual(Object.keys(enumeration), expected);
    assert.equal(Object.keys(enumeration).length, expected.length);

  });

  it('should be impossible to change the enumerations values', function () {
    var enumeration = Enum.create(['ONE', 'TWO']);
    assert.equal(enumeration.ONE, 1);
    enumeration.ONE = 2;
    assert.equal(enumeration.ONE, 1);
    assert(Object.isFrozen(enumeration));
  });

  it('should provide usable elements', function () {
    var enumeration = Enum.create(['ONE', 'TWO'])
      enumVar = enumeration.ONE;
    assert.notEqual(enumeration.ONE, enumeration.TWO);
    assert.equal(enumVar, enumeration.ONE);
    assert.notEqual(enumeration.ONE, enumeration.TWO);
    enumVar = enumeration.TWO;
    assert.equal(enumVar, enumeration.TWO);
    assert.notEqual(enumeration.ONE, enumeration.TWO);
  });

  it('should get element name by value', function () {
    var enumeration = Enum.create(['ONE', 'TWO', 'THREE']);
    ['ONE', 'TWO', 'THREE'].forEach(function (name) {
      assert.equal(enumeration.toString(enumeration[name]), name);
    });
  });

});