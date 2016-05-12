# scroll-monitor
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Creates scrollMonitor to monitor the scroll event, and allow callbacks to be registered for events: inc, dec, and change.

To register a callback with a scroll event: `scrollMonitor.on(event, callback);`

e.g.:
```js
scrollMonitor.on('inc', function () {});
```

Callbacks may be registered with parameters to be passed in.  e.g.:
```js
scrollMonitor.on('change', myCallback, 98, 'X');

function myCallback (number, character) {
  console.log(number, character); // 98 X
}
```

## To Do
* Vary the interval frequency to improve response time when scrolling while reducing load when not.
* Consider other singleton patterns, & metamorphosis pattern.
* Review jsdoc.
