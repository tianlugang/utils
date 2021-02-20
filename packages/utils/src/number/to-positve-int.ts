/**
   * 转为正整数
   * @param {number} n 任意数 
   * @param {number} def 
   */
export const toPositiveInt = (n: number, def = 0) => Number.isInteger(n) && n >= 0 ? n : def >= 0 ? def : 0;
//  Number.isInteger(n) ? Math.abs(n * 1) : null;