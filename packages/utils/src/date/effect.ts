/**
 * 任意对象转日期高度容错
 * @param  {Object} obj 要转换的日期
 * @return {type}     [description]
 */
export function dateEffect(obj: any): InstanceType<typeof Date> {
  if (obj instanceof Date || Object.prototype.toString.call(obj) === '[object Date]') {
    return obj;
  }

  // 时间必须大于0
  if (obj > 0) {
    // 数字或数字字符串转日期
    return new Date(parseInt(obj, 10));
  }

  //有效的日期字符串，
  // 比如: 2020-6-17 
  // 比如: 2020/6/17 
  // 比如: 6/17 2020
  // 比如: 6/17
  const dateTime = Date.parse(obj);

  if (!isNaN(dateTime)) {
    // UTC格式字符串转日期
    return new Date(dateTime);
  }

  // null, undefined, 0, '' 均返回当前时间
  return new Date();
}