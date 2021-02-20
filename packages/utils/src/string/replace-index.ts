/**
 * 替换字符串指定位置上的字符
 * @param {string} str 
 * @param {string} index 
 * @param {string} repval 
 * @example
 *    replaceIndex('|1|2|',"|",""); // 1|2
 *    replaceIndex("1,2,3,",""); // 1,2,3
 */
export const replaceIndex = (str: string, index: string | number, repval: string) => {
    switch (typeof index) {
        case 'string':
            return !index ? '' : str.replace(new RegExp(index), repval);
        case 'number':
            index = index < 0 ? str.length + index : index;
            return index < 0 ? str : str.replace(str[index], repval);
        default: return str;
    }
}