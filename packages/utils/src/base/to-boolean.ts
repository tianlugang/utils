/**
 * 字符串转换成boolean值
 * @param  {string} str 
 * @return {boolean}
 */
export const toBoolean = (str: string | boolean) => {
  if (typeof str !== 'string') return !!str;

  switch (str.toLowerCase()) {
    case 'false':
    case 'no':
    case '0':
    case 'null':
    case 'undefined':
      return false;
    case 'true':
    case 'yes':
    case 'ok':
    case '1':
      return true;
    default:
      return !!str;
  }
}
