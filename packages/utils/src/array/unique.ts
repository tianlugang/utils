/**
 * 数组去重 兼容一种数据类型 1 和 "1" 不能区分
 * @param arr 数组
 * @returns {T[]}
 */
export function unique<T = any>(array: T[]) {
    return array.filter(function (item, index, arr) {
        return arr.indexOf(item) === index;
    });
}