import { classOf } from '../base';
export const isError = (any: any) => (any instanceof Error || classOf(any) === '[object Error]')
