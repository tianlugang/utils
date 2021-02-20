import { classOf } from '../base'

/**
 * 是否为 WeakMap
 * @param {WeakMap} any 
 */
export const isWeakMap = (any: any) => classOf(any) === '[object WeakMap]'
