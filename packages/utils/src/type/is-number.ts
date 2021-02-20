import { classOf } from '../base';
export const isNumber = (n: any) => {
  if (typeof n === 'number' || classOf(n) === '[object Number]') {
    return true;
  }
  if (/^0x[0-9a-f]+$/i.test(n)) {
    return true;
  }
  return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(n);
}
