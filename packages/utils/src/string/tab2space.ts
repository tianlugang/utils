/**
 * tab转空格
 * @param {string} str 
 */
export const tab2space = (str: string) => str.replace(/\t*/g, '\t'.split(/\s/g).reduce(c => c + ' ', ''));
