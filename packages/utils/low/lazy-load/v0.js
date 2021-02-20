'use strict';
/*
 * 用例:
 * `<img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">`
 */
export function imageLazyLoad() {
  var $q = function (q, res) {
      if (document.querySelectorAll) {
        res = document.querySelectorAll(q);
      } else {
        var d = document,
          a = d.styleSheets[0] || d.createStyleSheet();
        a.addRule(q, 'f:b');
        for (var l = d.all, b = 0, c = [], f = l.length; b < f; b++)
          l[b].currentStyle.f && c.push(l[b]);

        a.removeRule(0);
        res = c;
      }
      return res;
    },
    addEventListener = function (evt, fn) {
      window.addEventListener ?
        this.addEventListener(evt, fn, false) :
        (window.attachEvent) ?
        this.attachEvent('on' + evt, fn) :
        this['on' + evt] = fn;
    },
    _has = function (obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    };

  function loadImage(el, fn) {
    var img = new Image(),
      src = el.getAttribute('data-src');

    src = src == null || src == undefined ? null : src;

    if (src == null) {
      return false;
    }

    img.onload = function () {
      if (el.tagName == "DIV") {
        el.style.backgroundImage = "url('" + src + "')";
      } else {
        if (!!el.parent)
          el.parent.replaceChild(img, el)
        else
          el.src = src;
      }


      fn ? fn() : null;
    }

    el.removeAttribute('data-src');
    img.src = src;
  }

  function elementInViewport(el) {
    var rect = el.getBoundingClientRect()

    return (
      rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    )
  }

  var images = new Array(),
    query = $q('.lazy'),
    processScroll = function () {
      for (var i = 0; i < images.length; i++) {
        if (elementInViewport(images[i])) {
          loadImage(images[i], function () {
            //images.splice(i, i);
          });
        }
      };
    },
    processScrollMobile = function () {
      for (var i = 0; i < images.length; i++) {
        loadImage(images[i], function () {
          //images.splice(i, i);
        });
      };
    };

  for (var i = 0; i < query.length; i++) {
    images.push(query[i]);
  };

  processScroll();
  addEventListener('scroll', processScroll);
  addEventListener('touchmove', processScrollMobile);
}
