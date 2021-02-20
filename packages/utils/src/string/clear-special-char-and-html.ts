import { clearSpecialChar } from './clear-special-char';
import { clearHtml } from './clear-html';

/**
 * 过滤指定字符和html标签
 * @param  {String} str    [要过滤的字符串]
 * @param  {String} filter [指定过滤字符]
 * @return {String}        [过滤后的字符串]
 */
export const clearSpecialCharAndHtml = (str: string, filter?: string) => {
    filter = filter || '.。<>《》!！～（）()…，。~“”\'?[]{},'; // 默认过滤的字符串

    return clearSpecialChar(clearHtml(str), filter);
}