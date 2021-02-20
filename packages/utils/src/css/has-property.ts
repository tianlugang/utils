import { hasOwnProperty } from '../base';

const dom = document.body || document.createElement('div');
const style = dom.style;

/**  
 * 判断浏览器是否有此Css属性
 */
export const hasCssProperty = (name: string): boolean => hasOwnProperty(style, name);
