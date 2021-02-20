/**
 * 给指定的HTML元素添加class
 * 
 * @param {HTMLElement} el 
 * @param {String} className 
 */
export namespace classes {
  export function add(el: HTMLElement, className: string) {
    if (className == null) return;
    const original = el.className;

    if (original.length === 0) {
      el.className = className;
      return;
    }

    if (original.match(new RegExp('(^|\\s)' + className + '(\\s|$)'))) {
      return;
    }

    el.className = original + ' ' + className;
  }

  export function remove(el: HTMLElement, className: string) {
    const original = el.className;

    if (original.length === 0) {
      return;
    }

    if (original == className) {
      el.className = '';
      return;
    }

    if (original.match(new RegExp('(^|\\s)' + className + '(\\s|$)'))) {
      el.className = original.replace((new RegExp('(^|\\s)' + className + '(\\s|$)')), '');
    }
  }

}