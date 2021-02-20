type IEventType<K = string> = K & keyof HTMLElementEventMap
type IEventHandler = EventListenerOrEventListenerObject
type IEvnetAddOptions = AddEventListenerOptions | boolean
type IEventRMOptions = EventListenerOptions | boolean

const events: string[] = [];
const regexOn = /^on/;

for (let eventname in window) {
  if (regexOn.test(eventname)) {
    events.push(eventname.slice(2));
  }
}

export const addEvent = (el: HTMLElement, type: IEventType, handler: IEventHandler, options: IEvnetAddOptions) => {
  return el.addEventListener(type, handler, options);
}

export const removeEvent = (el: HTMLElement, type: IEventType, handler: IEventHandler, options: IEventRMOptions) => {
  return el.removeEventListener(type, handler, options);
}

export const fabricateEvent = (el: HTMLElement, type: IEventType, bubbles: boolean = false, cancelable: boolean = false, detail?: any) => {
  var e;
  if (events.indexOf(type) === -1) {
    // IE >= 9
    e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
  } else {
    e = document.createEvent('Event');
    e.initEvent(type, bubbles, cancelable);
  }

  return el.dispatchEvent(e);
}

export const listenerFactory = (el: HTMLElement, fn: IEventHandler): EventListener => {
  return function handler(originalEvent: Event) {
    const e = originalEvent || window.event;
    e.preventDefault = e.preventDefault || function preventDefault() {
      e.returnValue = false;
    };
    e.stopPropagation = e.stopPropagation || function stopPropagation() {
      e.cancelBubble = true;
    };

    if (typeof fn === 'function') {
      fn.call(el, e);
    } else {
      fn.handleEvent.call(el, e);
    }
  };
}