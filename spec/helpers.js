var helpers = {

  initDragdealer: function(dragdealerId, options) {
    loadFixtures(dragdealerId + '.html');
    loadStyleFixtures(dragdealerId + '.css');

    return new Dragdealer(dragdealerId, options);
  },

  dragTo: function(dragdealerId, x, y, handleClass) {
    var $wrapper = $('#' + dragdealerId),
        $handle = $wrapper.find('.' + (handleClass || 'handle')),
        wrapperPosition = $wrapper.offset(),
        handlePosition = $handle.offset();

    // Move to current handle position and press
    $handle.simulate('mousemove', {
      clientX: handlePosition.left,
      clientY: handlePosition.top
    });

    $handle.simulate('mousedown');
    $handle.simulate('mousemove', {
      clientX: wrapperPosition.left + x,
      clientY: wrapperPosition.top + y
    });

    // Dragdealer internal animation delay is 25ms (this should be fixed and
    // dragdealer should be updated instantly on mousemove or mouseup)
    jasmine.Clock.tick(25);
  },

  drop: function(dragdealerId, x, y, handleClass) {
    var $handle = $('#' + dragdealerId).find('.' + (handleClass || 'handle'));
    $handle.simulate('mouseup');
  },

  touchDragTo: function (dragdealerId, x, y, handleClass) {
    var $wrapper = $('#' + dragdealerId),
        $handle = $wrapper.find('.' + (handleClass || 'handle')),
        wrapperPosition = $wrapper.offset(),
        handlePosition = $handle.offset();

    // Move to current handle position and start touch
    simulateTouchEvent($handle.get(0), 'touchstart', {
      clientX: handlePosition.left,
      clientY: handlePosition.top
    })

    simulateTouchEvent($wrapper.get(0), 'touchmove', {
      clientX: wrapperPosition.left + x,
      clientY: wrapperPosition.top + y
    });

    jasmine.Clock.tick(25);
  },

  touchDrop: function(dragdealerId, x, y, handleClass) {
    var $handle = $('#' + dragdealerId).find('.' + (handleClass || 'handle'));
    // trigger on document because doesn't bubble in old ies
    simulateTouchEvent(document, 'touchend')
  }

};

function simulateTouchEvent (element, type, touchOptions) {
  var event
  if (document.createEvent) {
    event = document.createEvent('UIEvent');
    event.initUIEvent(type, true, type !== 'touchcancel', window, 0)
  } else if (document.createEventObject) {
    event = document.createEventObject();
    event.type = type;
    event.cancelable = type !== 'touchcancel';
    event.view = window;
    event.detail = 0;
  }
  if (touchOptions) {
    event.touches = [touchOptions]
  }
  if (element.dispatchEvent) {
    element.dispatchEvent(event);
  } else if (element.fireEvent) {
    // we can't fire inexistent events
    element['on' + type](event);
  }
}

