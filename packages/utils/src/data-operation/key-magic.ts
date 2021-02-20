/**
 * @param {string} keys 
 * @example
 *   const demo = {
 *    a: {
 *       b: '1',
 *       c: {
 *          d: {
 *             e: 1
 *          }
 *       },
 *       d: [
 *          0,
 *          false,
 *          { a: 1, b: 2 },
 *          function () { }
 *       ],
 *       'e f': {
 *          a: 1
 *       }
 *    }
 * };
 * console.log(keyMagic(demo, 'a. d. 2 .b'));
 * console.log(keyMagic(demo, 'a.b'));
 * console.log(keyMagic(demo, 'a.e f'));
 */
export function keyMagic(obj: Record<string | number, any>, keys: string) {
  if (typeof keys === 'string') {
    for (let i = 0, array = keys.split('.'), limit = array.length, target = obj, key, current;
      i < limit; i++) {

      key = array[i].trim();
      if (!!key) {
        current = target[key];
        switch (typeof current) {
          case 'object': {
            target = current;
            if (limit === i + 1) {
              return target;
            }
            break;
          };
          case 'undefined':
            return;
          default:
            return current;
        }
      }
    }

    // return keys
    //    .split('.')
    //    .reduce((target, v) => {
    //       const key = v.trim();
    //       if (!!key) {
    //          if (target) {
    //             const current = target[key];

    //             if ('undefined' !== typeof current) {
    //                return current;
    //             }
    //          }
    //       } else { 
    //          return target;
    //       }
    //    }, obj);
  }
}