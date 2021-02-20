/**
 * 校验是否为中国大陆邮政编码
 * 参数value为数字或字符串
 * 校验规则： 共6位，且不能以0开头
 * @param {string} value 
 */
export const isPostCode = (value: string) => /^[1-9][0-9]{5}$/.test(value);
