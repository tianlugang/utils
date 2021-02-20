/**
 * 是否为有效字符串，会过滤掉空字符串
 * @param {string} any 
 */
export const isValidString = (any: any) => typeof any === 'string' && !!any.trim();
