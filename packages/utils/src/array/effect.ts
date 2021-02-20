type IEffectFilter<T> = {
    (value: T | unknown): boolean | undefined
}

/**
 * @name effect
 * @desc 声明一个有效的数组，默认过滤掉`null, undefined, ''`
 * @keyword array effect arrayify array.filter
 * @dependencies
 * @example
 *        effect(1);                         // => [1]
 *        effect();                          // => []
 *        effect([0, '', null, undefined]);  // => [0]
 *        effect([1,2,3,4], (value, index, array) => {
 *            return value % 2 === 0; // => [2, 4]
 *        });
 * @param {any} array 任意js对象
 * @param {function} filter 对 array 的过滤处理函数
 * @returns {array} 返回经过 filter 的数组，当传入一个数组时，返回原来的数组
 */
export function effect<T = any>(array: T[] | unknown, filter?: IEffectFilter<T>) {
    filter = typeof filter === 'function' ? filter : defaultFilter;

    if (Array.isArray(array)) {
        for (let i = 0; i < array.length; i++) {
            if (!filter(array[i])) {
                array.splice(i, 1);
                i--;
            }
        }

        return array;
    }

    const filtered = filter(array);
    return Array.isArray(filtered) ? filtered : [filtered];
}

function defaultFilter<T = any>(v: T | unknown) {
    return v != null;
}