import { classOf } from '../base';

export function isPlainObject(any: object) {
    if (!any || classOf(any) !== '[object Object]') {
        return false;
    }

    const hasOwn = Object.prototype.hasOwnProperty;
    const hasOwnConstructor = hasOwn.call(any, 'constructor');
    const hasIsPrototypeOf = any.constructor && any.constructor.prototype &&
        hasOwn.call(any.constructor.prototype, 'isPrototypeOf');

    if (any.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
    }

    let key;
    for (key in any) { }

    return 'undefined' === typeof key || hasOwn.call(any, key);
}

/**
 * 目标是否是一个纯对象 {}
 *
 * @param {object} obj
 **/
// export function isPlainObject(obj) {
//     if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
//         return false;
//     }

//     var hasOwn = Object.prototype.hasOwnProperty;
//     var hasOwnConstructor = hasOwn.call(obj, 'constructor');
//     var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');

//     // 自己的构造函数属性必须是对象。
//     if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
//         return false;
//     }

//     // 首先枚举自己的属性，以便加速，如果最后一个是自己的，那么所有的属性都是自己的。
//     var key;
//     for (key in obj) { }

//     return 'undefined' === typeof key || hasOwn.call(obj, key);
// };
