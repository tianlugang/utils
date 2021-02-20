const localStorage = window.localStorage;

type IAValue<T> = T | void
type IExpires = number
type IKey = string
type IValue<T = string> = {
  v: T
  e: IExpires
}
type IWatcher<T> = {
  (newValue: IAValue<T>, oldValue: IAValue<T>): void
}
type IStorageEvent<T, D> = Event & IStorageEventOptions<T, D>
type IStorageEventType = 'storage.get' | 'storage.set' | 'storage.remove' | 'storage.clear' | 'storage.has' | 'storage.toJSON'
type IStorageEventOptions<T, D> = {
  key: IKey | void
  oldValue: IAValue<T>
  newValue: IAValue<T>
  bubbles: boolean
  cancelable: boolean
  url: string
  storageArea: typeof localStorage
  data?: D
  expires: boolean
}

const timeNow = () => new Date().getTime();
const isExpires = <T>(item: IValue<T>) => item.e <= timeNow();
const getValue = <T>(item: IValue<T>) => item.v;
const packValue = <T>(value: T, expires: IExpires): string => {
  expires = expires > 0 ? timeNow() + expires * 1000 : 0;
  return JSON.stringify({
    v: value,
    e: expires
  });
};
const Storage = {
  reactive: true,
  get<T>(key: IKey): T | void {
    var value = localStorage.getItem(key);

    if (value == null) {
      return;
    }

    const item = JSON.parse(value) as IValue<T>;
    const opts = {
      key,
      expires: false,
      oldValue: getValue<T>(item)
    };

    if (isExpires(item)) {
      localStorage.removeItem(key);
      opts.expires = true
    }

    Storage.emit('storage.get', opts);

    return opts.oldValue
  },

  // 存储 过期时间单位秒
  set<T>(key: IKey, value: T, expires: IExpires = 0) {
    Storage.emit('storage.set', {
      key,
      oldValue: Storage.get(key),
      newValue: value
    });
    const str = packValue<T>(value, expires)

    localStorage.setItem(key, str);
  },

  // 移除
  remove(key: IKey) {
    Storage.emit('storage.remove', {
      key,
      oldValue: Storage.get(key)
    });
    localStorage.removeItem(key);
  },

  // 清空
  clear() {
    Storage.emit('storage.clear', {});
    return localStorage.clear();
  },

  // 包含
  has(key: IKey) {
    Storage.emit('storage.has', { key });

    return !!localStorage.getItem(key);
  },

  // 转为JSON
  toJSON(key?: IKey) {
    if (!!key && Storage.has(key)) {
      return Storage.get(key);
    }

    const jar: Record<string, any> = {};

    for (let i = 0, key; i < localStorage.length; i++) {
      key = localStorage.key(i);
      if (key) {
        jar[key] = Storage.get(key);
      }
    }

    Storage.emit('storage.toJSON', {});

    return jar;
  },

  // 监听指定的key
  watch<T>(key: IKey, callback: IWatcher<T>) {
    let oldValue = Storage.get<T>(key);
    let onChange = function (e: StorageEvent) {
      e = e || (window as any).storageEvent;
      if (e.key != key) {
        return
      }

      let newValue = Storage.get<T>(key);
      if (oldValue === newValue) {
        return
      }

      callback(newValue, oldValue);
      oldValue = newValue;
    };

    window.addEventListener('storage', onChange, false);
    return function unwatch() {
      oldValue = void 0;
      window.removeEventListener('storage', onChange, false);
    }
  },

  isReactived() {
    return Storage.reactive
  },

  on(type: IStorageEventType, listener: EventListener, options: AddEventListenerOptions | boolean = false) {
    if (Storage.isReactived()) {
      window.addEventListener(type, listener, options)
    }
  },

  off(type: IStorageEventType, listener: EventListener, options: EventListenerOptions | boolean = false) {
    if (Storage.isReactived()) {
      window.removeEventListener(type, listener, options)
    }
  },

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent 
   */
  emit<T, D>(type: IStorageEventType, options: Partial<IStorageEventOptions<T, D>>) {
    if (Storage.isReactived()) {
      const {
        key,
        newValue,
        oldValue,
        storageArea = localStorage,
        url = window.location.href,
        data,
        bubbles = false,
        cancelable = false
      } = options
      const event = document.createEvent('Event') as IStorageEvent<T, D>

      event.initEvent(type, bubbles, cancelable);
      event.key = key;
      event.newValue = newValue;
      event.oldValue = oldValue;
      event.storageArea = storageArea;
      event.url = url;
      event.data = data;

      window.dispatchEvent(event)
    }
  },
}

export default Storage
  // onstorage(key, callback, interval) {
  //   /*  
  //       IE6/IE7/Chrome使用Timer检查更新，其他使用onstorage事件 
  //       IE下即使是当前页面触发的数据变更，当前页面也能收到onstorage事件，其他浏览器则只会在其他页面收到    
  //       Chrome下(14.0.794.0)重写了document.domain之后会导致onstorage不触发     
  //       鉴于onstorage的兼容性问题暂时不使用onstorage事件，改用传统的轮询方式检查数据变化       
  //   */
  //   var oldValue = ls[key];

  //   function handler(e) {
  //     //IE下不使用setTimeout尽然获取不到改变后的值?!       
  //     setTimeout(function () {
  //       e = e || window.storageEvent;

  //       var eKey = e.key,
  //         newValue = e.newValue;
  //       //IE下不支持key属性,因此需要根据storage中的数据判断key中的数据是否变化       
  //       if (!eKey) {
  //         var nv = ls[key];
  //         if (nv != oldValue) {
  //           eKey = key;
  //           newValue = nv;
  //         }
  //       }

  //       if (eKey == key) {

  //         'function' === typeof callback && callback(newValue);
  //         oldValue = newValue;
  //       }
  //     }, 0);
  //   }

  //   if (useOnstorage) {
  //     //检查storage是否发生变化的时间间隔
  //     if ('number' !== typeof interval) {
  //       interval = 1000;
  //     }
  //     setInterval(function () {
  //       handler({});
  //     }, interval);
  //   } else {
  //     //IE注册在document上       
  //     if (document.attachEvent && Browser.name !== 'opera') {
  //       document.attachEvent("onstorage", handler);
  //     } else {
  //       //其他注册在window上   
  //       window.addEventListener("storage", handler, false);
  //     };
  //   }
  // }

// if (window.hasOwnProperty('onstorage')) {
// event = document.createEvent('StorageEvent');
// (event as any).initStorageEvent(
//   type,
//   bubbles,
//   cancelable,
//   key,
//   oldValue,
//   newValue,
//   window.location.href,
//   localStorage
// );
// }
