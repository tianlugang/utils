'use strict';

/**
 * 返回顶部的通用方法
 * @param {HTMLElement} button 
 */
export default function backTop(button) {
  var d = document.documentElement;
  var b = document.body;

  window.onscroll = set;
  button.style.display = "none";
  button.onclick = function onClick() {
    button.style.display = "none";
    window.onscroll = null;
    var timer = setInterval(function () {
      d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
      b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
      if (d.scrollTop + b.scrollTop <= 0) {
        clearInterval(timer);
        window.onscroll = set;
      }
    }, 10);
  };

  function set() {
    button.style.display = d.scrollTop + b.scrollTop > 100 ? "block" : "none";
  }
}
