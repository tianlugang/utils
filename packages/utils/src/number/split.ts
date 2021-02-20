// 拆分整数与小数
export const split = (trans: number | string) => {
  let value = new Array('', '');
  let temp = trans.toString().split('.');

  for (let i = 0; i < temp.length; i++) {
    value = temp;
  }

  return value;
}