/**
 * 数组扁平化 到指定的 深度
 *
 * @param  {Array}  array
 * @param  {Array}  result
 * @param  {Number} depth
 * @return {Array}
 */
export function flattenWithDepth(array: any[], result: any[], depth = 1) {
    for (let i = 0, value; i < array.length; i++) {
        value = array[i]

        if (depth > 0 && Array.isArray(value)) {
            flattenWithDepth(value, result, depth - 1)
        } else {
            result.push(value)
        }
    }

    return result
}