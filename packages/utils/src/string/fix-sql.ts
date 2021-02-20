/**
 * SQL防注入安全处理
 * @param {*} str 
 */
export const fixSql = (str: string) => str.replace(/'/g, '&#39;').replace(/--/g, '&#45;&#45;');