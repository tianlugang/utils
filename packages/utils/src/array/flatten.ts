/**
* 数组扁平化 到指定的 深度
*
* @param  {Array}  array
* @param  {Array}  result
* @param  {Number} depth
* @return {Array}
*/
export function flatten(array: any[], result: any[], depth: number | null = null) {
    for (let i = 0, value; i < array.length; i++) {
        value = array[i];

        if (Array.isArray(value)) {
            if (depth == null) {
                flatten(value, result, null)
            } else if (depth > 0) {
                flatten(value, result, depth - 1)
            }
        } else {
            result.push(value)
        }
    }

    return result
}