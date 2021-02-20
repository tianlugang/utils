/**
 * 校验是否为中国大陆传真或固定电话号码
 * @param {string} str 
 */
export const isFax = (str: string) => /^([0-9]{3,4})?[0-9]{7,8}$|^([0-9]{3,4}-)?[0-9]{7,8}$/.test(str)