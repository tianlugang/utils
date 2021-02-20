/**
 * @name group-by.size
 * @version 1.0.0
 * @description Strings are grouped by length
 * @dependencies
 * @keyword string string.group-by
 * @example
 *    import { groupBy } from '@tlg/utils';
 *    const string = 'aaabbbcccddd';
 *    groupBy(string, 3); // ['aaa', 'bbb', 'ccc', 'ddd']
 *
 * @param {string} str need group-by string
 * @param {number} n every group'length
 * @returns {array} a array or undefined
 */
export const groupBy = (str: string, n: number) => {
    const arr: string[] = [];

    if (typeof str === 'string') {
        if (n > 0) {
            for (let i = 0, max = Math.ceil(str.length / n); i < max; i++) {
                arr[i] = str.substring(i * n, (i + 1) * n);
            }
        }
    }

    return arr;
}