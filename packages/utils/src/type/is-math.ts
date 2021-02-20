import { classOf } from '../base'
export const isMath = (any: any) => classOf(any) === '[object Math]';
