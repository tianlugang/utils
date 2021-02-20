import { hasCssProperty } from './has-property';

export const prefixers = ['Webkit', 'Moz', 'O', 'ms', ''];
export const cssPrefixers = ['-webkit-', '-moz-', '-o-', '-ms-', ''];

/**
 * 从指定的浏览器前缀信息获取一组css样式字符串
 * 
 * @param {string} cssText css样式规则
 * @param {array} prefixeres defaults : ['-webkit-','-moz-','-ms-','-o-']
 * 
 * @desc **** 函数内部并没有实现针对那些样式属性存在需要添加浏览器私有前缀的判断
 * @desc **** 因此，在使用函数前请搞清楚改CSS样式属性需要前缀的必要性
 **/
export function setCssPrefixer(cssText: string, prefixeres: string[] = cssPrefixers) {
    return prefixeres.map(prefix => prefix + cssText).join(';').concat(';' + cssText + ';');
}

// 设置当前样式的前缀
export function setJsPrefixer(name: string, prefix: string) {
    return !prefix ? name : (prefix + name.charAt(0).toUpperCase() + name.substr(1));
}

// 获取当前浏览器的es css前缀
export function getCssPrefixer() {
    var testProp = 'Transform';
    for (let prefix of prefixers) {
        if (hasCssProperty(prefix + testProp)) {
            return prefix;
        }

        let lowPrefix = prefix.toLowerCase()
        if (hasCssProperty(lowPrefix + testProp)) {
            return prefix;
        }
    }

    return ''
}

// 
export const jsPrefixer = getCssPrefixer();

// 设置当前ES的前缀
export const lowPrefixer = jsPrefixer ? jsPrefixer === 'ms' ? 'MS' : jsPrefixer.toLowerCase() : '';

// 设置当前js使用的前缀
export const cssPrefixer = lowPrefixer ? lowPrefixer === 'MS' ? '-ms-' : `-${lowPrefixer}-` : '';