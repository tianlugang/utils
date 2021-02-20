/**
 * 数组扁平化,递归到叶子末梢
 * @param  {Array} array
 * @param  {Array} result
 * @return {Array}
 */
export function flattenForever(array: any[], result: any[]) {
    for (let i = 0, value; i < array.length; i++) {
        value = array[i]

        if (Array.isArray(value)) {
            flattenForever(value, result);
        } else {
            result.push(value);
        }
    }

    return result
}
