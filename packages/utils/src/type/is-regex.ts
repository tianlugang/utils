import { classOf } from '../base';
export const isRegExp = (any: any) => classOf(any) === '[object RegExp]';
