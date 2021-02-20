import { isPlainObject } from '../type/is-plain-object';

//  extend({a:1},{b:1},{c:1},{d:1})
// 对象拷贝
export function extend(...args: any[]) {
  var options, name, src, copy, copyIsArray, clone;
  var target = args[0];
  var i = 1;
  var length = args.length;
  var deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = args[1] || {};
    i = 2;
  }
  if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
    target = {};
  }

  for (; i < length; ++i) {
    options = args[i];

    // 只处理非 null/undefined 值
    if (options != null) {

      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target !== copy) {

          if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && isPlainObject(src) ? src : {};
            }

            target[name] = extend(deep, clone, copy);

          } else if (typeof copy !== 'undefined') {
            target[name] = copy;
          }
        }
      }
    }
  }

  return target;
}