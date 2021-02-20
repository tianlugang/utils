// 判断是否为数字类型
export function isDigit(value: any) {
  var regex = /^[0-9]*$/;
  if (regex.exec(value) == null || value == "") {
    return false;
  } else {
    return true;
  }
}
