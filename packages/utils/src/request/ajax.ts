import { noop, never } from '../base';
/**
 * 全局缓存 XMLHttpRequest 对象
 * @desc xhr.setRequestHeader('If-Modified-Since', '0'); 禁用缓存
 * @desc get head post put delete connect options trace patch
 *       GET 方法请求一个指定资源的表示形式.使用GET的请求应该只被用于获取数据.
 *       HEAD 方法请求一个与GET请求的响应相同的响应， 但没有响应体.
 *       POST 方法用于将实体提交到指定的资源， 通常导致状态或服务器上的副作用的更改.
 *       PUT 方法用请求有效载荷替换目标资源的所有当前表示。
 *       DELETE 方法删除指定的资源。
 *       CONNECT 方法建立一个到由目标资源标识的服务器的隧道。
 *       OPTIONS 方法用于描述目标资源的通信选项。
 *       TRACE 方法沿着到目标资源的路径执行一个消息环回测试。
 *       PATCH 方法用于对资源应用部分修改
 **/

type IBody = string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null;
type IMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'PATCH'
type IOptions = {
  url: string // 发送请求的url
  method: IMethod  // http连接的方式，包括POST和GET两种方式
  body: IBody // 发送的参数，格式为对象类型
  headers: Record<string, string> // 发送的请求头，格式为对象类型
  async: boolean // 是否为异步请求，true为异步的，false为同步的
  cache: boolean //  是否 URL 缓存请求
  withCredentials: boolean // 是否发送cookie
  timeout: number // 请求超时时间
  upload: boolean // 是否为上传模式
  onAbort: (evt: ProgressEvent) => void // 请求被中止
  onBefore: <T>(opt: T, xhr: XMLHttpRequest) => boolean // 发送前执行的回调函数
  onOK: <T>(res: T) => void // 发送并接收成功调用的回调函数
  onFailed: <T = any>(xhr: XMLHttpRequest, res: T) => void // 请求失败
  onError: () => void // 请求出错时执行的回调函数
  onChange: (e: Event, xhr: XMLHttpRequest) => void // 请求完成执行的回调函数
  onTimeout: () => void // 请求超时
  onProgress: () => void // 上传进度处理
  onLoad: () => void // 上传结束
};
type IPartialOptions = Partial<IOptions> & {
  url: string
}

const OPTIONS: IOptions = {
  method: 'GET',
  url: '',
  async: true,
  body: null,
  headers: {},
  cache: false,
  upload: false,
  withCredentials: true,
  timeout: 50000,
  onAbort: noop,
  onBefore: never,
  onOK: noop,
  onFailed: noop,
  onError: noop,
  onChange: noop,
  onTimeout: noop,
  onProgress: noop,
  onLoad: noop,
};
//  获取返回数据
const parseBody = (xhr: XMLHttpRequest) => {
  var text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

export namespace XMLRequest {
  // 合并配置到基础选项上
  export const config = (set: (common: IOptions) => void) => set(OPTIONS)

  // 发送请求
  export const request = <T>(opts: IPartialOptions) => {
    const {
      url,
      body,
      method = OPTIONS.method,

      cache = OPTIONS.cache,
      async = OPTIONS.async,
      withCredentials = OPTIONS.withCredentials,
      timeout = OPTIONS.timeout,
      headers = OPTIONS.headers,
      upload = OPTIONS.upload,

      onAbort = OPTIONS.onAbort,
      onBefore = OPTIONS.onBefore,
      onChange = OPTIONS.onChange,
      onError = OPTIONS.onError,
      onFailed = OPTIONS.onFailed,
      onLoad = OPTIONS.onLoad,
      onOK = OPTIONS.onOK,
      onProgress = OPTIONS.onProgress,
      onTimeout = OPTIONS.onTimeout,
    } = opts;
    const xhr = new XMLHttpRequest();

    if (onBefore(opts, xhr) === false) {
      return;
    }

    xhr.timeout = timeout;
    xhr.ontimeout = onTimeout;
    xhr.onerror = onError;
    xhr.onabort = onAbort;
    if (upload && xhr.upload) {
      xhr.upload.onprogress = onProgress;
      xhr.upload.onload = onLoad;
    } else {
      xhr.onprogress = onProgress;
      xhr.onload = onLoad;
    }
    xhr.onreadystatechange = (ev) => {
      onChange(ev, xhr);
      if (xhr.readyState === 4) {
        const body = parseBody(xhr);
        if (xhr.status < 200 || xhr.status >= 300) {
          onFailed(xhr, body);
        } else {
          onOK<T>(body);
        }
      }
    };

    xhr.open(method, url, async);

    // 携带cookie
    if (withCredentials && 'withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (headers) {
      // 设置请求头
      for (const key in headers) {
        if (headers.hasOwnProperty(key) && headers[key].length) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }

      // when set headers['X-Requested-With'] = null , can close default XHR header
      // see https://github.com/react-component/upload/issues/33
      if (headers['X-Requested-With'] != null) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }

      // 禁用缓存
      if (cache === false && headers['If-Modified-Since'] == null) {
        xhr.setRequestHeader('If-Modified-Since', '0');
      }
    }

    xhr.send(body);

    return xhr;
  }
}
