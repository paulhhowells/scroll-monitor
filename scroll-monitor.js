/**
 * @name scrollMonitor
 * @function
 * @requires: jQuery
 * @method: on
 * @returns: {object} An object with the on method.
 */
var scrollMonitor = (function(options) {
  'use strict';

  var
    INC = 'inc',
    DEC = 'dec',
    NONE = 'none',
    scrolling = false,
    scrollTop,
    previousScrollTop,
    intervalFrequencySlow = 300,
    intervalFrequencyFast = 150,
    intervalFrequency,
    intervalID,
    direction,
    previousDirection,
    callbacks;

  callbacks = {
    change : [],
    inc : [],
    dec : []
  };

  if (options) {
    if (options.hasOwnProperty('intervalFrequencySlow')) {
      intervalFrequencySlow = options.intervalFrequencySlow;
    }
    if (options.hasOwnProperty('intervalFrequencyFast')) {
      intervalFrequencySlow = options.intervalFrequencyFast;
    }
  }
  intervalFrequency = intervalFrequencySlow;

  // On ready.
  $(function () {
    // Capture scroll.
    $(window).on('scroll', scrollCallback);
  });

  intervalID = window.setInterval(intervalCallback, intervalFrequency);

  return {
    on : on
  };

  function on (event, fn) {
    var record = { fn : fn };

    if (arguments.length > 2) {
      record.args = Array.prototype.slice.call(arguments);
    }

    callbacks[event].push(record);
  }

  function event (direction) {
    if (callbacks.change.length > 0) {
      run(callbacks.change);
    }

    if (callbacks[direction] && callbacks[direction].length > 0) {
      run(callbacks[direction]);
    }
  }

  function run (records, message) {
    var
      i,
      arrayLength = records.length,
      record;

    for (i = 0; i < arrayLength; i++) {
      record = records[i];
      if (record.args) {
        record.fn.apply(this, record.args);
      }
      else {
        if (message) {
         record.fn(message);
        }
        else {
        record.fn();
      }
    }
  }
  }

  function intervalCallback () {
    if (scrolling) {

      // Determine direction of scroll.
      // It can be confusing to refer to scrolling up and down, so 'inc' and
      // 'dec' are used to record scrollTop increasing and decreasing.
      previousDirection = direction;
      if (scrollTop > previousScrollTop) {
        direction = INC;
      }
      else if (scrollTop < previousScrollTop) {
        direction = DEC;
      }
      else if (scrollTop === previousScrollTop) {
        direction = NONE;
      }

      // Has direction changed, but not stopped?
      if (direction !== previousDirection) {
        event(direction);
      }
    }
    else {
      // Regardless of the state of previousDirection, the scroll callback
      // has not recently set scroll to true, so assume that scrolling has
      // stopped, and therefore does not have a direction.
      direction = 'none';
    }

    scrolling = false;
  }

  function scrollCallback () {
    previousScrollTop = scrollTop;
    scrollTop = $(window).scrollTop();
    scrolling = true;
  }

  function startInterval () {
    window.clearInterval(intervalID);
    intervalID = window.setInterval(intervalCallback, intervalFrequency);
  }
}());
