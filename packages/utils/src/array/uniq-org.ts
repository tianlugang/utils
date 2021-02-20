/**
 * 数组去重
 * @param {Array} arr 
 * @param {Boolean} clean 是否清理所有重复值
 * @example
 *    var arr = [11, 22, 22, 44, 78, 78, 44, 44, 28, 29];
 *    
 *    uniqOrg(arr, true);
 *    var sec = arr.sort(function (a, b) {
 *        return a - b < 0;
 *    });
 *    
 *    console.log(arr, sec[1]);
 */
export function uniqOrg<T = any>(arr: T[], clean?: boolean) {
    if (!Array.isArray(arr)) return arr;

    for (var i = 0, r, v; i < arr.length; i++) {
        r = false;
        v = arr[i];

        for (var j = i + 1; j < arr.length; j++) {
            if (v === arr[j]) {
                r = true;

                arr.splice(j, 1); // 删除重复值
                j--;
            }
        }

        if (clean && r) {
            arr.splice(i, 1); // 把所有重复值到删掉
            i--;
        }
    }

    return arr;
}
