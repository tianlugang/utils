import { noop } from '../base';

type IDocumentExtra = Document & {
  createStyleSheet(url: string): unknown
}
type IScriptElement = HTMLScriptElement & {
  onreadystatechange: null | { (): unknown }
  readyState: 'loaded' | 'complete'
}
type IScriptSrc = string
type IScriptText = string
type IScriptCharset = string
type IScriptReady = {
  (): unknown
}

const doc = window.document as IDocumentExtra
const docCharset = document.characterSet || document.charset

export namespace Source {
  // 加载样式文件
  export function style(url: string) {
    try {
      doc.createStyleSheet(url);
    } catch (e) {
      let link = doc.createElement('link');
      let head = doc.getElementsByTagName('head')[0];

      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      head.appendChild(link);
    }
  }

  // 动态加载脚本文件
  export function script(src: IScriptSrc, callback: IScriptReady = noop, charset: IScriptCharset = docCharset) {
    var script = doc.createElement('script') as IScriptElement;
    var done = false;
    var onready = function () {
      if (done) return;
      done = true;
      typeof callback === 'function' && callback();
    };

    script.type = 'text/javascript';
    script.charset = charset;

    try {
      script.src = src;
      script.onload = onready;
      script.onerror = function () {
        script.onload = null
        script.onreadystatechange = null
        throw new Error('ES 404');
      };
      script.onreadystatechange = function () {
        if ((script.readyState == 'loaded' || script.readyState == 'complete')) {
          onready();
        }
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    } catch (err) {
      throw err
    }
  }

  // 动态加载脚本文件
  export function scriptText(text: IScriptText, charset: IScriptCharset = docCharset) {
    var script = doc.createElement('script') as IScriptElement;

    script.type = 'text/javascript';
    script.charset = charset;

    try {
      script.text = text;
      document.getElementsByTagName('head')[0].appendChild(script);
    } catch (err) {
      throw err
    }
  }
}