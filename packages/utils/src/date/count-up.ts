import { dateEffect } from './effect'

type IDateCountEvery = {
  (template: string): unknown
}

type IDateObject = Date | string | number


/**
 * 正计时, 秒级别计时器
 * @param {Function} render
 * day(天)-dd hrs(时)-hh mins(分)-mm secs(秒)-ss
 * @param {string} pattern 模式字符串
 * @param {string} starter 正计时起始日子
 */
export function dateCountUp(starter: IDateObject, fmt: string = 'dd-hh-mm-ss', render: IDateCountEvery) {
  let start = dateEffect(starter)
  let timer: ReturnType<typeof setTimeout>
  
  function run() {
    if (timer) clearTimeout(timer);
    var now = new Date();
    var diff = now.getTime() - start.getTime();

    // var sec = diff / 1000;
    // var e_sec = Math.floor(sec);

    // 天
    var eDays = diff / 86400000;
    var days = Math.floor(eDays);

    // 时
    var eHrs = (days - eDays) * -24;
    var hrs = Math.floor(eHrs);

    // 分
    var eMins = (hrs - eHrs) * -60;
    var mins = Math.floor((hrs - eHrs) * -60);

    // 秒
    var secs = Math.floor((mins - eMins) * -60).toString();

    var ret = fmt;
    var obj = {
      'd+': days, // 日
      'h+': hrs,  // 时
      'm+': mins, // 分
      's+': secs, // 秒
    };

    for (var k in obj) {
      if (new RegExp('(' + k + ')').test(ret)) {
        let value = (obj as any)[k];

        ret = ret.replace(RegExp.$1, RegExp.$1.length == 1 ? value : ('00' + value).substr((value + '').length));
      }
    }

    if (render(ret) === true) {
      return
    }

    timer = setTimeout(run, 1000);
  }

  run();
}
