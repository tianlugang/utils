import { getPunctuationRegex } from '../base/cn-punctuation-regex';

/**
 * 清除所有中文字符及空格（中文标点符号）
 * @param {string} str 
 * @returns {string}
 */
export const clearCNCharAndSpace = (str: string) => str.replace(/[\u4e00-\u9fa5 ]/g, '').replace(getPunctuationRegex(), '');