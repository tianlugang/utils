import { classOf } from '../base';
export const isWeakSet = (any: any) => classOf(any) === '[object WeakSet]';
