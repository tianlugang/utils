import { isPlainObject } from '../type/is-plain-object';

/**
 * @name object.size
 * @version 1.0.0
 * @desc
 *  Gets the number of accessible and enumerable properties of an object.
 *  for in	                  Array,Object 获取可枚举的实例和原型属性名
 *  Object.keys()	            Array,Object 返回可枚举的实例属性名组成的数组
 *  Object.getPropertyNames()	Array,Object 返回除原型属性以外的所有属性（包括不可枚举的属性）名组成的数组
 *  for of Iterable Object(Array, Map, Set, arguments ...)	返回属性值
 * @dependencies
 *   ./is.plain-object
 * @keyword object.size object.length object.keys
 * @example
 *    const obj = {a: 1, b:2, c:3 };
 *    getObjectSize(obj);        // 3
 *
 *    Object.defineProperty(obj, 'd', {
 *          value: 4,
 *          enumerable: true
 *    });
 *    getObjectSize(obj); // 4
 *
 *    Object.defineProperty(obj, 'e', {
 *          value: 5
 *    });
 *    getObjectSize(obj); // 4
 *
 *    getObjectSize(null); // error
 *    getObjectSize([1,2,3]); // error
 *    getObjectSize(1234); // error
 *    getObjectSize('1234'); // error
 */
export const getObjectSize = (obj: any) => {
  if (isPlainObject(obj)) {
    let cnt = 0;

    for (let _key in obj) {
      cnt++;
    }

    return cnt;
  }

  throw new TypeError('Only for pure object length fetch, but this type:' + typeof obj);
}