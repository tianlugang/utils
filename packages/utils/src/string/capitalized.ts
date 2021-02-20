/**
 * 英文单词首字母大写
 * @param {string} str 
 **/
export const capitalized = (str: string) => str.charAt(0).toUpperCase().concat(str.substr(1));
