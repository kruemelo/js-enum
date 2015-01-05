define([], function () {

  'use strict';

  var Enum = function () {};

  Enum.prototype.create = function (_elements) {

    var elements,
      enumeration,
      fnToString = function (value) {
        for (var el in this) {
          if (value === this[el]) {
            return el;
          }
        }
      };

    enumeration = Object.create(Object.prototype);

    Object.defineProperty(enumeration, 'toString', {
      value: fnToString
    });

    if (Array.isArray(_elements)) {
      elements = {};
      _elements.forEach(function (elName, index) {
        elements[elName] = Math.pow(2, index);
      });
    }
    else {
      elements = _elements;
    }

    for (var el in elements) {
      Object.defineProperty(enumeration, el, {
        value: elements[el],
        enumerable: true
      });
    };

    (Object.freeze || Object)(enumeration);
    return enumeration;
  };

  return new Enum;

});
