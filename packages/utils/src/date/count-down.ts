import { dateEffect } from './effect'

type IDateCountEvery = {
    (template: string): unknown
}
type IDateObject = Date | string | number

/**
 * 倒计时
 * @param {Function} render
 * @param {string} pattern
 * @param {Date|DateString|time} ender
 * @param {function} finished
 */
export function dateCountDown(ender: IDateObject, fmt: string = 'dd-hh-mm-ss', every: IDateCountEvery, finished?: () => void) {
    const end = dateEffect(ender)
    let timer: ReturnType<typeof setTimeout>

    // 这里使用0-11分别表示1-12月
    function run() {
        if (timer) clearTimeout(timer);
        var now = new Date();
        var diff = end.getTime() - now.getTime();

        // var e_sec = diff / 1000;
        // var sec = Math.floor(e_sec);

        // 天
        var e_days = diff / 86400000;
        var days = Math.floor(e_days);

        // 时
        var e_hrs = (e_days - days) * 24;
        var hrs = Math.floor(e_hrs);

        // 分
        var e_mins = (e_hrs - hrs) * 60;
        var mins = Math.floor((e_hrs - hrs) * 60);

        // 秒
        var secs = Math.floor((e_mins - mins) * 60);

        if (days < 0) {
            typeof finished === 'function' && finished();
            return;
        }

        var ret = fmt;
        var obj = {
            'd+': days, // 日
            'h+': hrs,  // 时
            'm+': mins, // 分
            's+': secs, // 秒
        }

        for (var k in obj) {
            if (new RegExp('(' + k + ')').test(ret)) {
                let value = (obj as any)[k];

                ret = ret.replace(RegExp.$1, RegExp.$1.length == 1 ? value : ('00' + value).substr((value + '').length));
            }
        }

        every(ret);
        timer = setTimeout(run, 1000);
    }

    run();
}