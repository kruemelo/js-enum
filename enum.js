(function(definition) {
    if (typeof module !== 'undefined') {
      module.exports = definition();
    }
    else if (typeof define === 'function' && typeof define.amd === 'object') {
      define(definition);
    }
}(function () {

  'use strict';

  var Enum = function (_elements) {

    var elements,
      enumeration,
      isNumeric = Array.isArray(_elements),
      numberOfElements,
      maxElements = isNumeric ?
        Math.log2 && Math.log2(Number.MAX_VALUE) || Math.log(Number.MAX_VALUE) / Math.LN2 : undefined,
      numVal = 1;

    enumeration = this;

    if (isNumeric && _elements.length > maxElements) {
      throw new Error('EMAXNUMBEROFELEMENTSEXCEEDED');
    }

    Object.defineProperty(enumeration, 'toString', {
      value: function (value) {
        for (var el in this) {
          if (value === this[el]) {
            return el;
          }
        }
      }
    });

    Object.defineProperty(enumeration, 'set', {
      value: function (elVal, _setVal) {

        if (isNumeric) {

          if (undefined === _setVal) {
            _setVal = elVal;
          }

          (Array.isArray(_setVal) ? _setVal : [_setVal])
            .forEach(function (v) {
              elVal = undefined === elVal ? v : elVal | v;
            });
          return elVal;
        }

        return _setVal || elVal;

      }
    });

    Object.defineProperty(enumeration, 'isset', {
      value: function (elVal, _checkVal) {

        var isset = false;

        if (isNumeric) {
          (Array.isArray(_checkVal) ? _checkVal : [_checkVal])
            .some(function (v) {
              if ((elVal & v) === v) {
                return isset = true;
              }
            });
        }
        else {
          (Array.isArray(_checkVal) ? _checkVal : [_checkVal])
            .some(function (v) {
              if (elVal === v) {
                return isset = true;
              }
            });
        }
        return isset;
      }
    });


    if (isNumeric) {

      Object.defineProperty(enumeration, 'unset', {
        value: function (elVal, _setVal) {
          (Array.isArray(_setVal) ? _setVal : [_setVal])
            .forEach(function (v) {
              elVal &= ~v;
            });
          return elVal;
        }
      });

      numVal = 0x1;
      elements = {};
      numberOfElements = 0;
      _elements.forEach(function (elName) {
        elements[elName] = numVal;
        numVal = numVal << 1;
        ++numberOfElements;
      });

      Object.defineProperty(enumeration, 'length', {
        value: function () {
          return numberOfElements;
        }
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
    }

    (Object.freeze || Object)(enumeration);

  };

  return Enum;

}));
