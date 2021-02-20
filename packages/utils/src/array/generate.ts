interface IArrayGenerateCallback<T> {
    (index: number, array: T[]): T
}

/**
 * 根据 length 生成数组
 * @param {Number} length 
 * @param {Function} generate 
 * @returns {Array}
 */
export function generate<T = any>(length: number, generater: IArrayGenerateCallback<T>): T[] {
    var array = new Array(length);

    if (typeof generater === 'function') {
        for (let i = 0; i < length; i++) {
            array[i] = generater(i, array);
        }
    }

    return array;
}