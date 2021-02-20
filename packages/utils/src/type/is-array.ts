import { classOf } from '../base';

export const isArray = Array.isArray ? Array.isArray : (any: any) => classOf(any) === '[object Array]'
