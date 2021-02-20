/**
 * 是否为有限数字
 * @param {any} value 
 */
export const isNumeric = (value: string | number) => {
  return !isNaN(parseFloat(value as any)) && isFinite(value as any);
}
