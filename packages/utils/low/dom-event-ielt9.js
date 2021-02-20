'use strict';

/**
 * @function addListener 添加句柄
 * @param {HTMLElement} element DOM元素引用
 * @param {string} type 事件名称
 * @param {function} handler 事件处理函数
 **/
export function addEventListener(element, type, handler) {
  element.attachEvent('on' + type, handler);
}

/**
 * @function delListener 删除句柄
 * @param {HTMLElement} element DOM元素引用
 * @param {string} type 事件名称
 * @param {function} handler 事件处理函数的名称
 * @description 匿名的事件处理函数不能删除
 **/
export function removeEventListener(element, type, handler) {
  element.detachEvent('on' + type, handler);
}

/**   
 * @function dispatch 触发事件
 * @param {HTMLElement} element DOM元素
 * @param {string} type 触发的事件类型 
 **/
export function dispatchEvent(element, type) {
  var evt = document.createEventObject();

  return element.fireEvent('on' + type, evt);
}
