/**
 * 校验是否为中国大陆手机号
 * @param {number} value 
 */
export const isTel = (value: string | number) => /^1[3,4,5,6,7,8,9][0-9]{9}$/.test(value.toString());
