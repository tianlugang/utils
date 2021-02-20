type IEventType = string
type IEventListener<T = Event> = (evt: T) => void
type IEventList = Array<IEventListener>
type IEventOptions = {
  once: boolean
  prep: boolean
}

// observer
// 全局基础配置 所有 EventEmitter 实例的共享
type IEventSuper = {
  // 原生的事件注册函数
  add(type: IEventType, listener: IEventListener, opts?: IEventOptions): void

  // DOM原生的事件自动触发与伪造事件模型函数
  remove(type: IEventType, listener: IEventListener, opts?: IEventOptions): void

  // DOM原生的事件销毁函数
  dispatch(type: IEventType, list: IEventList, listener: IEventListener, ...args: any[]): void

  // 事件执行器
  compose?<T = Event>(evt: T, listeners: IEventList): unknown
}

function setListener(opts: IEventOptions, type: IEventType, maxListeners: number, stack: Map<IEventType, IEventListener>, supers: IEventSuper) {
  const list = new Array<IEventListener>(maxListeners);
  const listener = (evt: Event) => {
    if (supers.compose) {
      supers.compose(evt, list);
    } else {
      list.forEach(listener => listener(evt));
    }
    if (opts.once) {
      supers.remove(type, listener, opts);
      stack.delete(type);
    }
  };

  supers.add(type, listener, opts);
  stack.set(type, listener);

  return list;
}

export function eventFactory(supers: IEventSuper) {
  const queue = new Map<IEventType, IEventList>();
  const stack = new Map<IEventType, IEventListener>();
  // 内置最大监听数量，超过这个数量会抛出一个警告
  const defaultMaxListeners = 5;
  let maxListeners = 0;

  const event = {
    // 获取事件监听的最大个数
    getMaxListeners() {
      return maxListeners;
    },

    // 默认情况下，如果为特定事件添加了超过 10 个监听器，则 EventEmitter 会打印一个警告。
    // 此限制有助于寻找内存泄露
    setMaxListeners(n: number) {
      maxListeners = n < 0 ? defaultMaxListeners : Math.floor(n);
    },

    // 返回一个列出触发器已注册监听器的事件的数组, 数组中的值为字符串或符号。
    eventName() {
      return queue.keys();
    },

    // 获取指定事件的监听器的数量
    listeners(type: string) {
      var list = queue.get(type);

      return list ? list.length : 0;
    },

    // 绑定事件监听
    on(type: IEventType, listener: IEventListener, opts: IEventOptions) {
      let list = queue.get(type);

      if (!list) {
        list = setListener(opts, type, maxListeners, stack, supers);
        queue.set(type, list);
      }

      if (opts.prep) {
        list.unshift(listener);
      } else {
        list.push(listener);
      }

      if (list.length >= maxListeners && maxListeners !== 0 && maxListeners !== Infinity) {
        console.warn(`[EventEmiter Warn] 事件'${type}'的监听器数量已超过${maxListeners}，可能会造成内存溢出等异常`);
      }
    },

    // 前置事件监听程序
    prep(type: IEventType, listener: IEventListener, opts?: IEventOptions) {
      opts = Object.assign({}, opts);
      opts.prep = true;
      event.on(type, listener, opts);
    },

    // 绑定执行一次的事件监听
    once(type: IEventType, listener: IEventListener, opts?: IEventOptions) {
      opts = Object.assign({}, opts);
      opts.once = true;
      event.on(type, listener, opts);
    },

    // 移除指定的事件监听
    off(type: IEventType, listener?: IEventListener, opts?: IEventOptions) {
      const list = queue.get(type);
      if (!list) {
        return
      }

      if (listener) {
        const index = list.indexOf(listener);
        if (index >= 0) {
          list.splice(index, 1);
        }
      } else {
        list.length = 0;
      }

      if (list.length === 0) {
        queue.delete(type);
        const listeners = stack.get(type);

        if (listeners) {
          supers.remove(type, listeners, opts);
          stack.delete(type);
        }
      }
    },

    //  主动触发指定的事件监听
    //  按监听器的注册顺序，同步地调用每个注册到名为 type 事件的监听器，并传入提供的参数。
    //  如果事件有监听器，则返回 true ，否则返回 false。
    emit(type: IEventType, ...args: any[]) {
      const list = queue.get(type);
      const listener = stack.get(type);
      if (list && listener) {
        supers.dispatch(type, list, listener, ...args);
      }
    }
  }

  return event;
}
