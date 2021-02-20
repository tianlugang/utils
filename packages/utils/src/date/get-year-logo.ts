import { locale } from './locale';

/**
 * @param {number} y 当前年份
 */
export const getYearLogo = (y: number, yearLogo = locale.yearLogo) => yearLogo[y == 0 ? 0 : y < 0 ? 1 : 2];
