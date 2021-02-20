/**
 * 校验两个参数是否完全相同，包括类型
 * 校验规则：
 * 值相同，数据类型也相同
 * @param {any} v1 
 * @param {any} v2 
 */
export const isSame = (v1: any, v2: any) => v1 === v2;
