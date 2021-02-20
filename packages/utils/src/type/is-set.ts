import { classOf } from '../base';
export const isSet = (any: any) => classOf(any) === '[object Set]';
