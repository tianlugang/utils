import { dateEffect } from './effect'

interface IDateFormatterOption {
  "y+": number
  "M+": number
  "d+": number
  "h+": number
  "m+": number
  "s+": number
  "q+": number
  "S": number
}

/**
 * @param {string} fmt
 * @param {object} obj
 * @param {Date} date
 * @returns {object}
 * @example
 *  var date = new Date();
 *  var obj = {
 *    "M+": date.getMonth() + 1,               // 月份
 *    "d+": date.getDate(),                    // 日
 *    "h+": date.getHours(),                   // 小时
 *    "m+": date.getMinutes(),                 // 分
 *    "s+": date.getSeconds(),                 // 秒
 *    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
 *    "S": date.getMilliseconds()             //毫秒
 *  };
 *  var dateString = format('MM-dd-hh-mm-ss', obj, date);
 */
export function dateFormat(date: Date | string | number, fmt: string, obj?: IDateFormatterOption) {
  date = dateEffect(date)
  if (typeof obj !== 'object' || !obj) {
    obj = {
      "y+": date.getFullYear(), // 年
      "M+": date.getMonth() + 1, // 月
      "d+": date.getDate(), // 日
      "h+": date.getHours(), // 时
      "m+": date.getMinutes(), // 分
      "s+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in obj) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      let value = (obj as any)[k];

      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (value) : (("00" + value).substr(("" + value).length)));
    }
  }

  return fmt;
}
