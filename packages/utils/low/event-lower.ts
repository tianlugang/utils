namespace IE {
  export type DomElement = Element & {
    attachEvent(type: string, listener: EventListener): void
    detachEvent(type: string, listener: EventListener): void
    fireEvent(type: string, evt: IEventExtra): void
  }

  export type Doc = Document & {
    attachEvent(type: string, listener: EventListener): void
    detachEvent(type: string, listener: EventListener): void
    createEventObject(): IEventExtra
  }
}

type IEventType<K = string> = K & keyof HTMLElementEventMap
type IEventHandler = EventListenerOrEventListenerObject
type IEvnetAddOptions = AddEventListenerOptions | boolean
type IEventRMOptions = EventListenerOptions | boolean
type IEventExtra<D = any> = Event & {
  data?: D
}

const ieDoc = document as IE.Doc

// 事件监听新增
export const addEvent = typeof window.addEventListener === 'function' ?
  (el: HTMLElement, type: IEventType, handler: IEventHandler, options: IEvnetAddOptions = false) => {
    el.addEventListener(type, handler, options);
  } :
  typeof ieDoc.attachEvent === 'function' ?
    (el: IE.DomElement, type: IEventType, handler: EventListener) => {
      el.attachEvent('on' + type, handler);
    } :
    (el: HTMLElement, type: IEventType, handler: EventListener) => {
      (el as any)['on' + type] = handler;
    };

// 事件监听器移除
export const removeEvent = typeof window.removeEventListener === 'function'
  ? (el: HTMLElement, type: IEventType, handler: IEventHandler, options: IEventRMOptions = false) => {
    el.removeEventListener(type, handler, options);
  }
  : typeof ieDoc.detachEvent === 'function'
    ? (el: IE.DomElement, type: IEventType, handler: EventListener) => {
      el.detachEvent('on' + type, handler);
    } :
    (el: IE.DomElement, type: IEventType) => {
      (el as any)['on' + type] = null;
      delete (el as any)['on' + type];
    };

/**
 * @see http://www.cristinawithout.com/content/function-trigger-events-javascript
 */
export const dispatchEvent = typeof document.createEvent === 'function'
  ? <D = any>(el: HTMLElement, type: IEventType, data: D, bubbles: boolean = true, cancelable: boolean = false) => {
    var event = document.createEvent('Event') as IEventExtra<D>;

    event.data = data;
    event.initEvent(type, bubbles, cancelable);
    el.dispatchEvent(event);
  }

  : typeof ieDoc.createEventObject === 'function'
    ? <D = any>(el: IE.DomElement, type: IEventType, data: D) => {
      var event = ieDoc.createEventObject();

      event.data = data || {};
      el.fireEvent('on' + type, event);
    }

    : <D = any>(el: HTMLElement, type: IEventType, data: D) => {
      var listener = (el as any)['on' + type]
      if (typeof listener === 'function') {
        listener({
          data: data || {},
          type: type,
          target: el
        });
      }
    };