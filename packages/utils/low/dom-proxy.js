function genProxy() {
  return new Proxy({}, {
    get(target, tag) {
      return function (attrs = {}, ...children) {
        // 创建dom结构
        const el = document.createElement(tag);
        for (let prop of Object.keys(attrs)) {
          el.setAttribute(prop, attrs[prop]);
        }
        for (let child of children) {
          if (typeof child === 'string') {
            child = document.createTextNode(child);
          }
          el.appendChild(child);
        }
        return el;
      };
    }
  });
}

export const DOMP = genProxy();
