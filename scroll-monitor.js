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
    zero,
    callbacks;

  callbacks = {
    change : [],
    dec : [],
    inc : [],
    stop : [],
    zero : []
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

        event(direction);

      if (direction !== previousDirection) {
        event('change', direction);
      }

      // Hypothesis: a scroll event occurs whenever scrollTop becomes zero.
      if (scrollTop > 0) {
        zero = false;
      }
      else if (zero !== true) {
        event('zero');
        zero = true;
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
