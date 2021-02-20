/**
 * 校验字符是否以字母开头
 * 必须以字母开头
 * 开头的字母不区分大小写
 * @param {string} str 
 */
export const isLetterBegin = (str: string) => /^[A-z]/.test(str);
