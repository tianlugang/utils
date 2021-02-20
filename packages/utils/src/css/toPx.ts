/**
 * 值转 px
 * @param {number|string} num 
 */
export function toPx(num: string | number) {
  num = num.toString().trim();
  return num === '' ? '0px' : num.endsWith('px') ? num : (num + 'px');
}
