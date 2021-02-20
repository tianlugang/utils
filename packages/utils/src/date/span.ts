const formatDate = require('./date-format');

/**
 * 1s = 1000ms
 * 1m = 60 * 1000ms
 * 1h = 60 * 60 * 1000
 * 1d = 24 * 60 * 60 * 1000
 *
 * [timespan 转换阶梯时间]
 * @param  {Number} timestamp [时间戳]
 * @param  {String} fmt [需要显示的格式，例如yyyy-MM-dd hh:mm:ss]
 * @return {String}      [转换后的时间字符串]
 */
export function timespan(timestamp: number, fmt: string = 'yyyy.MM.dd') {
  const histroy = parseInt(timestamp.toString(), 10);
  const nowDate = new Date();
  const current = nowDate.getTime();
  const differe = current - histroy; // 差值
  const aYearAgo = new Date(nowDate) // 从当前时间前置一年，获取到当时的时间戳

  aYearAgo.setFullYear(nowDate.getFullYear() - 1);

  if (aYearAgo.getTime() > histroy) {
    // 大于一年前，显示yyyy.mm.dd（例：2016.05.20）
    return formatDate(histroy, 'yyyy.MM.dd');
  }

  if (differe > 864e6) {
    // 10天前，显示mm.dd hh: mm（例：04.05 16:05）
    // return formatDate(histroy, 'mm.dd hh:mm')
    return formatDate(histroy, fmt);
  }

  if (differe > 2592e5) {
    // 小于10天（含10天），显示x天前；
    return parseInt((differe / 864e5).toString(10), 10) + '天前';
  }
  if (differe > 1728e5) {
    // 2天到3天之前前天；
    return '前天';
  }
  if (differe > 864e5) {
    // 1天到2天之间，显示昨天；
    return '昨天';
  }
  if (differe > 36e5) {
    // 小于一天，显示x小时前；
    return parseInt((differe / 36e5).toString(10), 10) + '小时前';
  }
  if (differe > 6e4) {
    // 小于1小时，显示x分钟前；
    return parseInt((differe / 6e4).toString(10), 10) + '分钟前';
  }
  // 小于1分钟，显示“刚刚”；
  return '刚刚';
}

