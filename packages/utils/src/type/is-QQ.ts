/**
 * 校验是否为QQ号码
 * 校验规则：非0开头的5位 - 13位整数
 * @param {number} value 
 */
export const isQQ = (value: string | number) => /^[1-9][0-9]{4,12}$/.test(value.toString());
