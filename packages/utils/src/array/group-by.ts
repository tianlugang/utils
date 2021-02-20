/**
 * @description Arrays are grouped by length
 * @dependencies
 * @keyword array array.group-by
 * @example
 *    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; 
 *    console.log(groupBySize(arr, 5));
 *    // [ [ 1, 2, 3, 4, 5 ], [ 6, 7, 8, 9, 10 ], [ 11, 12 ] ]
 *
 * @param {array} str need group-by array
 * @param {number} n every group'length
 * @returns {array} a array or undefined
 */
export function groupBySize<T = any>(arr: T[], n: number = 1) {
    if (Array.isArray(arr) && n > 0) {
        const mod = arr.length % n;
        const tmp: T[][] = [];
        let limit = Math.floor(arr.length / n);

        while (limit--) {
            tmp.push(arr.splice(0, n));
        }

        if (mod > 0) {
            tmp.push(arr.splice(0, mod));
        }

        return arr;
    }

    return arr;
}

export function groupBySizeV1<T = any>(arr: T[], n: number = 1) {
    const tmp: T[][] = [];
    if (Array.isArray(arr) && n > 0) {
        while (arr.length) {
            tmp.push(arr.splice(0, n));
        }

        return tmp;
    }

    return tmp;
}

export function groupBySizeV2<T = any>(arr: T[], n: number = 1) {
    if (Array.isArray(arr) && n > 0) {
        const tmp = [];

        for (let i = 0, max = Math.ceil(arr.length / n); i < max; i++) {
            tmp[i] = arr.slice(i * n, (i + 1) * n);
        }

        return tmp;
    }

    return arr;
}