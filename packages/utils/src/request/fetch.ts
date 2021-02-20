import { noop } from '../base';
import * as Errors from '../base/error';
import { speedmeter } from '../spin/speedmeter';

type IProgress = {
  length: number // 文件总长度
  transferred: number // 已发送
  runtime: number // 已耗时
  percentage: number // 已上传的占比 
}
type IProgressing = {
  (progress: IProgress): void
}
type IOptions = RequestInit & {
  // API URL
  url: RequestInfo
  // json 请求返回成功
  json: boolean
  // 请求处理的进度
  onProgress: IProgressing
  // 默认的 contentLength 文件上传时必选
  contentLength: number
  // 进度条触发(计算)延迟 
  progressDelay: number
  // err 请求的超时
  timeout: number
  // HTTP method
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'PATCH'
}
type IPartialOptions = Partial<IOptions> & {
  url: RequestInfo
}

// 上传进度
const getProgress = (onProgress: IProgressing, length: number = 3000, delay: number = 30) => {
  const now = Date.now();
  const pgs: IProgress = {
    length, // 文件总长度
    transferred: 0, // 已发送
    runtime: Date.now(), // 已耗时
    percentage: 0, // 已上传的占比 
  };
  const spin = speedmeter(length);
  const setProgress = (percentage: number) => {
    pgs.percentage = percentage;
    pgs.runtime = Date.now() - now;
    pgs.transferred = length * percentage;
    onProgress(pgs);
  }
  const ret = (res: Response) => res;
  const timer = setInterval(() => setProgress(spin(pgs.percentage)), delay);

  ret.end = () => {
    setProgress(1);
    timer && clearInterval(timer);
  };

  return ret;
}

// 抛出一个错误
const createError = (message: string|Error, ...args: string[]) => Errors.create('FetchError', message, ...args);

// 自定义的默认配置
const OPTIONS: IOptions = {
  contentLength: 0,
  json: true,
  onProgress: noop,
  progressDelay: 10,
  timeout: 50000,
  url: '',

  // 基础配置
  //* [string](GET)
  //  请求的方式, 例如: `GET`,`POST`
  method: 'GET',

  //* [Headers|object] 
  // 请求头部, 需要用到 Headers 对象，有些 headers 已经被禁用了
  // see https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
  headers: undefined,

  //* [Blob|BufferSource|FormData|URLSearchParams|USVString]
  // 请求的的body体，需要发送的数据
  // `GET` 或 `HEAD` 不能包含数据
  body: undefined,

  //* [String](no-cors)
  // 请求的模式，可选值： `cors`,`no-cors`,or `same-origin`
  mode: 'no-cors',

  //* [String](same-origin)
  // 发起有凭证的请求，可选值： `omit`, `same-origin`, or `include`
  // 当提供此项时，在当前domain下，会自动发送cookies， 从Chrome 50开始兼容
  // 这个属性是 `FederatedCredential` 或 `PasswordCredentials`的实例
  credentials: 'same-origin',

  //* [String]()
  // 请求使用的缓存方式,可选值：
  // `default`, `no-store`, `reload`, `no-cache`, `force-cache`, `only-if-cached`
  // see https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
  cache: 'default',

  //* [String](follow)
  // 重定向模式， 可选值：follow，error，manual
  // `follow` 自动跟踪重定向的URL
  // `error` 当产生重定向时报出一个错误
  // `manual` 手动处理请求的重定向
  redirect: 'follow',

  //* [String](client)
  // 规格化`USVString`，可选值 `no-referrer` , `client` or a `URL`
  referrer: 'client',

  //* [String](origin)
  // 指定 referrer HTTP 的头的值, 可能是以下值：
  // `no-referrer`, `no-referrer-when-downgrade`, `origin`, `origin-when-cross-origin`, `unsafe-url`.
  referrerPolicy: 'origin',

  //* [String]()
  // 请求包含完整的 `subresource` (e.g. sha256-....)
  integrity: undefined,

  //* [Boolean](false)
  // 是否允许请求在页面`outlive`时持久，其功能替换了 `Navigator.sendBeacon()` 的API
  keepalive: false,

  //* [AbortSignal]
  // 请求终止信道
  // 需要 `AbortSignal` 对象实例, 允许用你手动停止请求，可以使用 `AbortController` 
  // 对象来提供 `AbortSignal` 实例
  signal: null
};

export namespace Fetch {
  // 合并配置到基础选项上
  export const config = (set: (common: IOptions) => void) => set(OPTIONS);

  // 请求发起
  export const request = <T = any>(opts: IPartialOptions): PromiseLike<T> => {
    const {
      contentLength,
      json,
      onProgress,
      progressDelay,
      timeout,
      url,
      ...init
    } = Object.assign({}, OPTIONS, opts);
    const progress = getProgress(onProgress, contentLength, progressDelay);
    const promises = [
      fetch(url, init).then(progress).then(res => {
        let err;
        try {
          if (res.ok) {
            return json ? res.json() : res;
          }

          err = createError(`${res.status}: ${res.statusText}`);
        } catch (error) {
          err = error;
        }

        throw createError(err);
      }),
      new Promise<T>((_resolve, reject) => {
        setTimeout(() => {
          reject(createError('timeout: $1', timeout + ''));
        }, timeout);
      })
    ];

    return Promise.race<T>(promises).finally(() => progress.end());
  }
}