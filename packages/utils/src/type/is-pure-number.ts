/**
 * 校验字符是否为纯数字(整数)
 * 字符全部为正整数(包含0)
 * 可以以0开头
 * @param {string} str 
 */
export const isPureNummber = (str: string | number) => /^[0-9]*$/.test(str.toString());
