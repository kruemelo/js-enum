// $ mocha
var path = require('path');
var assert = require('assert');
var util = require('util');
var requirejs = require('requirejs');

var Enum = requirejs('enum.js');
var maxItems = Math.log2 && Math.log2(Number.MAX_VALUE) || Math.log(Number.MAX_VALUE) / Math.LN2;
var maxItemsArray = [];
var tooManyItemsArray = [];

describe('enum', function () {

  before(function () {
    var i = 0;
    for (; i < maxItems; ++i) {
      maxItemsArray.push(i.toString());
      tooManyItemsArray.push(i.toString());
    }
    tooManyItemsArray.push((i + 1).toString());
  });


  it('should define an enumeration from string array', function () {

    var enumeration = new Enum([
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


  it('should define an enumeration from object', function () {

    var enumeration = new Enum({
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

    var enumeration = new Enum(['ONE', 'TWO', 'FOUR']),
      index = 0,
      expected = ['ONE', 'TWO', 'FOUR'];

    for (var el in enumeration) {
      assert.equal(el, expected[index++]);
    }

    assert.deepEqual(Object.keys(enumeration), expected);
    assert.equal(Object.keys(enumeration).length, expected.length);

  });


  it('should be impossible to change the enumerations values', function () {

    var enumeration = new Enum(['ONE', 'TWO']);

    assert.equal(enumeration.ONE, 0x1);
    enumeration.ONE = 0x2;
    assert.equal(enumeration.ONE, 0x1);
    assert(Object.isFrozen(enumeration));
  });


  it('should provide usable elements', function () {

    var enumeration = new Enum(['ONE', 'TWO'])
      enumVar = enumeration.ONE;

    assert.notEqual(enumeration.ONE, enumeration.TWO);
    assert.equal(enumVar, enumeration.ONE);
    assert.notEqual(enumeration.ONE, enumeration.TWO);
    enumVar = enumeration.TWO;
    assert.equal(enumVar, enumeration.TWO);
    assert.notEqual(enumeration.ONE, enumeration.TWO);
  });


  it('should get element name by value', function () {

    var enumeration = new Enum(['ONE', 'TWO', 'FOUR']);

    ['ONE', 'TWO', 'FOUR'].forEach(function (name) {
      assert.equal(enumeration.toString(enumeration[name]), name);
    });
  });


  it('should set a value to variable bitwise OR', function () {

    var enumeration = new Enum(['ONE', 'TWO', 'FOUR']),
      v = enumeration.ONE;

    assert.equal(v, 0x1);
    v = enumeration.set(v, enumeration.TWO);
    assert.equal(v, 0x3);
    v = enumeration.set(v, enumeration.FOUR);
    assert.equal(v, 0x7);

    v = enumeration.set(enumeration.FOUR);
    assert.equal(v, 0x4);
  });


  it('should set multiple values to variable bitwise OR at once', function () {

    var enumeration = new Enum(['ONE', 'TWO', 'FOUR']),
      v;

    v = enumeration.set([enumeration.ONE, enumeration.TWO]);
    assert.equal(v, 0x3);
  });


  it('should set multiple values to a variable', function () {

    var enumeration = new Enum(['ONE', 'TWO', 'FOUR']),
      v = enumeration.ONE;

    assert.equal(v, 0x1);
    v = enumeration.set(v, [enumeration.TWO, enumeration.FOUR]);
    assert.equal(v, 0x7);
  });


  it('should determine wether a variable has set a value', function () {

    var enumeration = new Enum(['ONE', 'TWO', 'FOUR']),
      v = enumeration.FOUR;

    v = enumeration.set(v, enumeration.TWO);
    assert.strictEqual(enumeration.isset(v, enumeration.ONE), false);
    assert.strictEqual(enumeration.isset(v, enumeration.TWO), true);
    assert.strictEqual(enumeration.isset(v, enumeration.FOUR), true);

    v = enumeration.set(v, enumeration.ONE);
    assert.strictEqual(enumeration.isset(v, enumeration.ONE), true);
  });

  it('should determine wether a variable has set values', function () {

    var enumeration = new Enum(['ONE', 'TWO', 'FOUR']),
      v = enumeration.FOUR;

    v = enumeration.set(v, enumeration.TWO);
    assert.strictEqual(enumeration.isset(v, enumeration.ONE), false);
    assert.strictEqual(enumeration.isset(v, [enumeration.TWO, enumeration.FOUR]), true);

    v = enumeration.set(v, enumeration.ONE);
    assert.strictEqual(enumeration.isset(v, [enumeration.ONE, enumeration.TWO, enumeration.FOUR]), true);
  });


  it('should unset a value', function () {

    var enumeration = new Enum(['ONE', 'TWO', 'FOUR']),
      v = enumeration.set([enumeration.ONE, enumeration.FOUR]);

    assert.strictEqual(v, 0x5);

    v = enumeration.unset(v, enumeration.TWO);
    assert.strictEqual(v, 0x5);

    v = enumeration.unset(v, enumeration.FOUR);
    assert.strictEqual(v, 0x1);

  });

  it('should unset multiple values at once', function () {

    var enumeration = new Enum(['ONE', 'TWO', 'FOUR']),
      v = enumeration.set([enumeration.ONE, enumeration.TWO, enumeration.FOUR]);

    assert.equal(v, 0x7);

    v = enumeration.unset(v, [enumeration.ONE, enumeration.TWO]);
    assert.equal(v, enumeration.FOUR);

  });

  it('should have function length() (numeric only)', function () {

    var items = ['ONE', 'TWO', 'FOUR'],
      itemsLength = items.length,
      enumeration = new Enum(items);

    assert.equal(typeof enumeration.length, 'function', 'should have a property "length" of type "function"');

    // add one which should not be part of the enumeration
    items.push('EIGHT');

    assert.strictEqual(enumeration.length(), items.length - 1, 'should have one item less than elements in "items"-array');
    assert.strictEqual(enumeration.length(), itemsLength, 'should have the same length as itemsLength');
  });

  it('should create up to Math.log2(Number.MAX_VALUE) items (numeric only)', function () {

    var enumeration;

    assert.strictEqual(maxItemsArray.length, maxItems, 'self test: max items array should have number of items ' + maxItemsArray.length + ' equal to maxItems ' + maxItems);

    enumeration = enumeration = new Enum(maxItemsArray);

    assert.strictEqual(enumeration.length(), maxItems, 'should have created an enum with ' + maxItems + ' items but did ' + enumeration.length() + ' only');
  });

  it('should handle too many items (numeric only)', function () {

    var enumeration;

    assert.strictEqual(
      tooManyItemsArray.length,
      maxItems + 1,
      'self test: tooManyItemsArray should have number of items ' + maxItemsArray.length + ' equal to maxItems ' + (maxItems + 1)
    );

    assert.throws(function () {
      enumeration = new Enum(tooManyItemsArray);
    }, function (err) {
      if ((err instanceof Error) && /EMAXNUMBEROFELEMENTSEXCEEDED/.test(err)) {
        return true;
      }
    }, 'unexpected error');

  });

});