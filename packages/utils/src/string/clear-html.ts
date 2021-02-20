/**
 * 过滤html标记（以<开头并且<后紧接字母或/字母，至>结束的内容为HTML标记）
 * @param [HTMLString] html字符串
 * @returns {string}
 */
export const clearHtml = (str: string) => str.replace(/<\/?[a-z][^<>]*>/ig, '').replace(/&[a-z]+/gi, '');