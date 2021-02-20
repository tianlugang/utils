/**
 * 过滤特殊字符，默认保留 英文 数字 汉字
 * @param {string} str 
 * @param {string} keepChars 需要保留的特殊字符集，为空时则只保留英文数字和汉字
 * @returns {string} 
 * @example 
 *     filterSpecialChar('!（1!@23/_ab\'c-￥"("-_")');  // "123_abc-"
 */
export const clearSpecialChar = (str: string, keepChars: string) =>
    str.replace(/[^0-9a-z\u4e00-\u9fa5]/ig, (c) =>
        (keepChars || '').indexOf(c) !== -1 ? c : '');
