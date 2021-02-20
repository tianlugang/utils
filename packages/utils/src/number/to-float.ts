/**
 * 强制在数字后面增加小数位数
 * @param  {Number} number [要转换的数字]
 * @param  {Number} fixed  [需要添加几位小数]
 * @return {String}        返回转换后的字符串数字
 */
export function float(number: number, fixed: number = 0) {
  number = isNaN(number) ? 0 : number;
  fixed = fixed >= 0 ? fixed : 2;
  let string = parseFloat(number.toFixed(fixed)).toString();
  let dotIndex = string.indexOf('.');

  if (dotIndex < 0) {
    dotIndex = string.length;
    string += '.';
  }

  while (string.length <= dotIndex + fixed) {
    string += '0';
  }

  return string;
}

