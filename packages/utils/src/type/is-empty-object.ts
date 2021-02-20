/**
 * 是否为空对象, 不存在自身属性的对象
 * @param {object} obj 
 * @return {boolean}
 */
export const isEmptyObject = (obj: object) => {
  if (Object.getOwnPropertyNames) {
    return Object.getOwnPropertyNames(obj).length === 0;
  }

  var k;
  for (k in obj) {
    if (obj.hasOwnProperty(k)) {
      return false;
    }
  }
  return true;
}
