import { classOf } from '../base'
/**
 * 是否日期对象
 * @param {any} obj 
 */
export const isDate = (obj: any) => obj instanceof Date || classOf(obj) === '[object Date]'