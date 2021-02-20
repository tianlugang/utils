/**
 * 数组去重 可以 区分 1 和 "1"
 * @param arr 数组
 * @returns {T[]}
 */
export function uniq<T = any>(arr: T[]) {
    var ret = [];

    for (var i = 0; i < arr.length; i++) {
        if (ret.indexOf(arr[i]) === -1) {
            ret.push(arr[i]);
        }
    }

    return ret;
}