import { getPunctuationRegex } from '../base/cn-punctuation-regex';

/**
 * 校验是否包含中文字符(包括中文标点符号)
 * @param {string} str 
 * @returns {boolean}
 */
export const hasCNChar = (str: string) => /[\u4e00-\u9fa5]/.test(str) || getPunctuationRegex().test(str);