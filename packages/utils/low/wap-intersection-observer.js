'use strict';

/**
 * #################
 * 兼容处理: 
 * @default window.IntersectionObserver
 * @default window.IntersectionObserverEntry
 * 
 * @desc 交叉观察器, 自动"观察"元素是否可见, 解决scroll事件密集发生，计算量很大，容易造成性能的问题。
 * @desc 当前脚本解决移动端（WAP）HTML5的兼容
 * @see http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html
 * @since 以下脚本自己编写，参考如上文档
 */
import isDOM from './is-dom';

/**
 * scroll事件在wap端的兼容
 * 
 * @param {function} callback 事件监听器处理函数
 * @param {boolean} isRemoved 移除事件监听器
 */
function compatScrollListener(callback, isRemoved = false) {
  function listener() {
    callback();
  }
  if (isRemoved) {
    window.removeEventListener('scroll', listener, false, true);
    window.removeEventListener('touchmove', listener, false, true);
  } else {
    window.addEventListener('scroll', listener, false, true);
    window.addEventListener('touchmove', listener, false, true);
  }
}

// 获取窗口的高度 
function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight;
}

/**
 * Observer constructor
 * @constructor IntersectionObserver
 * @param {Function} callback
 * @param {Object} options
 */
export class CompatIntersectionObserver {
  constructor(callback, options) {

    // 如果回调不是一个函数，抛出错误。
    if ('function' !== typeof callback) {
      throw new TypeError('Failed to construct \'IntersectionObserver\': The callback provided as parameter 1 is not a function');
    }

    // 阈值
    this.threshold = options.threshold || [0];
    this.callback = callback;

    // 接受数字作为阈值选项。
    if ('number' === typeof this.threshold) {
      this.threshold = [this.threshold];
    }

    // 当阈值超出范围时抛出错误。
    if (this.threshold[0] > 1 || this.threshold[0] < 0) {
      throw new RangeError('Failed to construct \'IntersectionObserver\': Threshold values must be between 0 and 1');
    }

    // 创建数组保存可观察的元素
    this.elements = [];

    // 防止频繁框架调用 
    this.ticking = false;
  }

  // 当元素变得可见时触发动作。
  trigger(target) {
    var arr = target ? [target] : this.elements,
      count = arr.length,
      changes = [],
      el,
      rect,
      viewportH = IntersectionObserver.viewportHeight;

    for (let i = 0; i < count; i++) {
      el = arr[i];
      rect = el.getBoundingClientRect();

      if (rect.top < viewportH && rect.top >= -rect.height) {
        changes.push({
          boundingClientRect: rect,
          target: el,
          time: performance.now()
        });
      }
    }

    // 对观察者进行一系列的更改和引用来执行回调。
    this.callback.call(this, changes);

    // 清除变量引用以防止内存泄漏。
    arr = count = changes = el = rect = null;

    // 重置 ticking
    this.ticking = false;
  }

  // 防止频繁触发
  debounceTrigger() {
    if (!this.ticking) {
      window.requestAnimationFrame(function () {
        this.trigger();
      }.bind(this));
    }
    this.ticking = true;
  }

  // 在可观察元素的数组中添加元素。
  observe(target) {
    if (isDOM(target)) {

      // 如果数组是空的，则重新合并滚动侦听器。
      if (this.elements.length === 0) {
        compatScrollListener(this.debounceTrigger.bind(this));
      }

      this.elements.push(target);

      // 元素已经可见。
      this.trigger(target);
    } else {
      throw new TypeError('Failed to execute \'observe\': parameter 1 is not of type \'Element\'');
    }
  }

  // 从可观察的元素数组中移除元素。
  unobserve(target) {

    if (isDOM(target)) {
      const index = this.elements.indexOf(target);

      if (index > -1) {
        this.elements.splice(index, 1);
      }

      // 元素数组为空是删除侦听器。
      if (this.elements.length === 0) {
        this.disconnect();
      }
    } else {
      throw new TypeError('Failed to execute \'unobserve\': parameter 1 is not of type \'Element\'');
    }
  }

  // 关闭监听
  disconnect() {
    compatScrollListener(this.debounceTrigger.bind(this), true);
  }
}

// 静态属性
IntersectionObserver.viewportHeight = getWindowHeight();

window.addEventListener('resize', function () {
  IntersectionObserver.viewportHeight = getWindowHeight();
});
