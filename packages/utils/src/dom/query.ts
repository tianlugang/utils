type IQueryContext = HTMLElement | HTMLDocument

export var isNodeList = (el: any) => el != null && (el instanceof HTMLCollection || el instanceof NodeList);
export var isDOM = function (obj: any): boolean {
  isDOM = (typeof HTMLElement === 'object')
    // 是否为DOM元素 
    ? function (obj: any) {
      return obj instanceof HTMLElement
    }
    : function (obj: any) {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
    }

  return isDOM(obj)
}

export var toHTMLNode = (html: string) => {
  var div = document.createElement('div');
  div.innerHTML = html;

  return div.children;
}

export function querys(selector: string | NodeList | HTMLCollection | [], context: IQueryContext = document) {
  if (Array.isArray(selector)) return selector;
  if (isDOM(selector)) return [selector];
  if (isNodeList(selector)) return selector;

  // 根据 selector 得出的结果（如 DOM，DOM List）
  if (typeof selector === 'string') {
    selector = selector.replace('/\n/mg', '').trim(); // 字符串
    if (selector.indexOf('<') === 0) {
      return toHTMLNode(selector); // 如 <div>
    }

    return context.querySelectorAll(selector);
  }

  return [];
}
/**
 * document.querySelector的包装
 * @param {*} exp 
 * @param {*} ctx 
 */
export function query(exp: string, ctx: IQueryContext = document) {
  let node
  try {
    node = ctx.querySelector(exp);
  } catch (error) {
    error.message += '\n   ' + 'Your Selector ' + exp;
  }

  return node;
}

/**
 * document.querySelectorAll的包装，同其参数
 * @param {*} exp 
 * @param {*} ctx 
 */
export function queryAll(exp: string, ctx: IQueryContext = document) {
  let nodelist
  try {
    nodelist = ctx.querySelectorAll(exp);
  } catch (error) {
    error.message += '\n   ' + 'Your Selector ' + exp;
  }

  return nodelist;
}
