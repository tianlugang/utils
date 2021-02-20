import * as Errors from '../base/error';

interface IJsonpOptions<T> {
  timeout?: number // 请求的超时时间
  charset?: string // 请求使用的字符集
  callback?: string // 与被请求地址约定的callback名称
  onError(err: Error): void
  onOk(res: T): void
}
type IJsonpResHandle<T> = {
  (res: T): void
} | null

type IJsonpContext = {
  [x: string]: IJsonpResHandle<any>
}

const jsonpc: IJsonpContext = {}
const destroy = (uid: string, tid: ReturnType<typeof setTimeout>) => {
  var script = document.getElementById(uid);
  if (script) {
    document.getElementsByTagName('head')[0].removeChild(script);
  }
  if (tid) {
    clearTimeout(tid);
  }
  try {
    delete jsonpc[uid];
  } catch (e) {
    jsonpc[uid] = null;
  }
}
const createError = (message: string) => {
  return Errors.create('JsonpError', message)
}

export namespace Jsonp {
  export const get = <T = any>(url: string, option: IJsonpOptions<T>) => {
    if (url.trim().length === 0) {
      throw createError('`url` must be a valid string!');
    }

    (window as any).jsonpc = jsonpc;
    const {
      callback = 'callback',
      timeout = 100000,
      charset = (document.characterSet || document.charset),
      onError,
      onOk
    } = option;
    const uid = '__' + Date.now() + '_' + Math.floor(Math.random() * 100000);
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      destroy(uid, timer);
      onError(createError('Request timeout.'));
    }, timeout);

    url += (url.indexOf('?') === -1) ? '?' : '&';
    script.id = uid;
    script.src = url.concat(`${callback}=${uid}`);
    script.charset = charset;

    jsonpc[uid] = (res: T) => {
      destroy(uid, timer);
      onOk(res)
    };

    script.onabort = () => {
      destroy(uid, timer);
      onError(createError('Request abort.'));
    }

    script.onerror = () => {
      destroy(uid, timer);
      onError(createError('Request error.'));
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  export const promise = <T = any>(url: string, option?: IJsonpOptions<T>) => {
    return new Promise((resolve, reject) => {
      get<T>(url, Object.assign({}, option, {
        onError: reject,
        onOk: resolve
      }));
    });
  }
}