import { locale } from './locale';

/**
 * 获取当前所在时段
 * @param {number} h 小时数
 */
export const getHoursPeriod = (h: number, periods = locale.periods) => h < periods.length ? periods[h] : void 0;