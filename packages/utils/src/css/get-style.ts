export const getCssProperty = (el: HTMLElement, prop: string, pseudo: string | null = null) => {
  var result;

  if ('getComputedStyle' in window) {
    /** 
     * 返回一个对象，
     * 该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。 
     * 私有的CSS属性值可以通过对象提供的API
     * 或通过简单地使用CSS属性名称进行索引来访问。
     * 
     * let style = window.getComputedStyle(element, [pseudoElt]);
     * pseudoElt 指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle  
     */
    result = getComputedStyle.call(window, el, pseudo);

    if (result !== null) {
      if (prop) {
        result = result.getPropertyValue(prop);
      }
    } else {
      throw new Error('getComputedStyle returning null.');
    }
  } else {
    result = !pseudo && (el as any).currentStyle && (el as any).currentStyle[prop];
  }

  return result;
}
