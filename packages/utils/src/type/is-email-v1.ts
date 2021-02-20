/**
 * 校验是否为邮箱地址
 * @param {string} str 
 */
export const isEmailV1 = (str: string) => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(str);
