// tap事件的延时
const TIME_DELAY = {
  TAP: 250, // 轻触
  LONG_TAP: 750 // 长按
};

/**
 * 
 * @function getStat
 * @desc 统计touch、gesture事件触发过程中的必要的数据信息 
 * @returns {object}
 *
 **/
function getStat() {
  const stat = Object.create(null);

  stat.startX = 0; // 起始坐标X
  stat.startY = 0; // 起始坐标Y
  stat.movedX = 0; // 移动量X
  stat.movedY = 0; // 移动量Y
  stat.totalX = 0; // 总移动量X
  stat.totalY = 0; // 总移动量Y
  stat.stime = 0; // 耗时开始
  stat.etime = 0; // 耗时结束 
  stat.switch = false; // 移动开关

  return oStat;
}
/** 
 * touch系列事件
 * 
 * @method swipe 
 * @method swipeLeft 
 * @method swipeRight 
 * @method swipeUp 
 * @method swipeDown 
 * @method tap 
 * @method doubleTap 
 * @method singleTap 
 * @method longTap 
 *
 * 触屏滑动事件管理
 * */
export function touch({
  onstart,
  onmove,
  onend
}) {

  // 合并参数
  onstart = 'function' === typeof onstart ? onstart : noop;
  onmove = 'function' === typeof onmove ? onmove : noop;
  onend = 'function' === typeof onend ? onend : noop;

  const oStat = getStat();

  function touchstart(e) {
    oStat.switch = true;

    let eTouch;
    if (e.touches) {
      eTouch = e.touches[0];
    }

    oStat.startX = eTouch ? eTouch.clientX : e.clientX;
    oStat.startY = eTouch ? eTouch.clientY : e.clientY;
    oStat.stime = +new Date();
    onstart.call(this, e, oStat);
  }

  function touchmove(e) {
    if (oStat.switch) {
      let eTouch;
      if (e.touches) {
        eTouch = e.touches[0];
      }

      const clientX = eTouch ? eTouch.clientX : e.clientX;
      const clientY = eTouch ? eTouch.clientY : e.clientY;

      oStat.movedX = clientX - oStat.startX;
      oStat.movedY = clientY - oStat.startY;
      oStat.totalX += oStat.movedX;
      oStat.totalY += oStat.movedY;

      onmove.call(this, e, oStat);
    }
  }

  function touchcancel(e) {
    if (oStat.switch) {
      oStat.switch = false;
      oStat.etime = +new Date();

      onend.call(this, e, oStat);
    }
  }

  if ('ontouchstart' in window) {
    document.addEventListener('touchstart', touchstart, false, false);
    document.addEventListener('touchmove', touchmove, false, true);
    document.addEventListener('touchend', touchcancel, false, false);
    document.addEventListener('touchcancel', touchcancel, false, false);
  } else {
    document.addEventListener('mousedown', touchstart, false, false);
    document.addEventListener('mousemove', touchmove, false, false);
    document.addEventListener('mouseup', touchcancel, false, false);
  }
}

// 
export function swipe() {}

// 


/**
 * 
 * @param {object} param0 
 */
export function touchs({
  selector,
  onstart,
  onmove,
  onend
}) {

}

;
(function ($) {
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event) {
    return (event.pointerType == 'touch' ||
        event.pointerType == event.MSPOINTER_TYPE_TOUCH) &&
      event.isPrimary
  }

  function isPointerEventType(e, type) {
    return (e.type == 'pointer' + type ||
      e.type.toLowerCase() == 'mspointer' + type)
  }

  $(document).ready(function () {
    var now, delta, deltaX = 0,
      deltaY = 0,
      firstTouch, _isPointerType

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body
    }

    $(document)
      .bind('MSGestureEnd', function (e) {
        var swipeDirectionFromVelocity =
          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null
        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe')
          touch.el.trigger('swipe' + swipeDirectionFromVelocity)
        }
      })
      .on('touchstart MSPointerDown pointerdown', function (e) {
        if ((_isPointerType = isPointerEventType(e, 'down')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        if (e.touches && e.touches.length === 1 && touch.x2) {
          // Clear out touch movement data if we have it sticking around
          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
          touch.x2 = undefined
          touch.y2 = undefined
        }
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $('tagName' in firstTouch.target ?
          firstTouch.target : firstTouch.target.parentNode)
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = firstTouch.pageX
        touch.y1 = firstTouch.pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
        // adds the current touch contact for IE gesture recognition
        if (gesture && _isPointerType) gesture.addPointer(e.pointerId)
      })
      .on('touchmove MSPointerMove pointermove', function (e) {
        if ((_isPointerType = isPointerEventType(e, 'move')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        cancelLongTap()
        touch.x2 = firstTouch.pageX
        touch.y2 = firstTouch.pageY

        deltaX += Math.abs(touch.x1 - touch.x2)
        deltaY += Math.abs(touch.y1 - touch.y2)
      })
      .on('touchend MSPointerUp pointerup', function (e) {
        if ((_isPointerType = isPointerEventType(e, 'up')) &&
          !isPrimaryTouch(e)) return
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
          (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function () {
            if (touch.el) {
              touch.el.trigger('swipe')
              touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            }
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function () {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap')
              event.cancelTouch = cancelAll
              // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
              if (touch.el) touch.el.trigger(event)

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el) touch.el.trigger('doubleTap')
                touch = {}
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function () {
                  touchTimeout = null
                  if (touch.el) touch.el.trigger('singleTap')
                  touch = {}
                }, 250)
              }
            }, 0)
          } else {
            touch = {}
          }
        deltaX = deltaY = 0

      })
      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

    $(window).on('scroll', cancelAll)
  })
})(Zepto)
