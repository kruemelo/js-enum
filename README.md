js-enum
=======

javascript enumerations

´´´
var Enum = require('enum.js');

// numeric enum

var appStateEnum = new Enum([
  'LOADED', 'STARTED', 'RESUMED', 'PAUSED', 'STOPPED', 'DESTROYED'
]);

var appState = appStateEnum.set(appStateEnum.LOADED);
-> 0x1 (appStateEnum.LOADED)

appState = appStateEnum.set(appState, [appStateEnum.STARTED, appStateEnum.RESUMED]);
-> 0x7 (appStateEnum.LOADED, appStateEnum.STARTED, appStateEnum.RESUMED)

appStateEnum.isset(appState, appStateEnum.LOADED);
-> true

appStateEnum.isset(appState, appStateEnum.STOPPED);
-> false

appStateEnum.isset(appState, [appStateEnum.STOPPED, appStateEnum.RESUMED]);
-> true (some: appStateEnum.RESUMED)

appState = appStateEnum.unset(appState, [appStateEnum.LOADED, appStateEnum.RESUMED]);
-> 0x2 (appStateEnum.STARTED)

// object enum
var ordinalEnum = new Enum({
  ONE: 'first',
  TWO: 'second',
  THREE: 'third'
});

var ordinal = ordinalEnum.set(ordinalEnum.ONE);
-> 'first'

ordinalEnum.isset(ordinal, ordinalEnum.TWO);
-> false

ordinalEnum.isset(ordinal, ordinalEnum.ONE);
-> true

ordinal = ordinalEnum.unset(ordinal, ordinalEnum.ONE);
-> error: undefined is not a function

´´´