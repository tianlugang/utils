/**
 * 校验是否包含空格
 * @param {String} str 
 */
export function stringHasSpace(str: string) {
    return /[ ]/.test(str);
}