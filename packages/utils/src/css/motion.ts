import { noop } from '../base';
import { cssPrefixer, lowPrefixer } from './perfixer';
 
type IMotionElement<T> = T & HTMLElement
type IMotionOnStart<T> = IMotionElement<T> | {
  (): IMotionElement<T>
}
type IMotionOnEnd<T> = (el: IMotionElement<T>) => unknown
type IMotionListener = {
  (evt: IMotionEvent): unknown
}
type IMotionEvent = TransitionEvent | AnimationEvent
type IAddMotionListenerOptions = AddEventListenerOptions | boolean
type IOffMotionListener = {
  (): void
}
type IMotionAbortHandler = {
  (): void
}
const hasMotionEvent = 'TransitionEvent' in window || 'AnimationEvent' in window;

/**
 * 获取指定的css属性值
 */
const getMotionTimeStyle = (el: HTMLElement, prop: string) => {
  const style = window.getComputedStyle(el, null);
  let value: string | number = 0;

  if (style) {
    value = style.getPropertyValue(prop);
    if (!value) {
      value = style.getPropertyValue(cssPrefixer + name);
    }

    value = parseFloat(value) || 0;
  }

  return value;
}

// 当浏览器不支持动画时
const fakeHandleMotionEvent = (listener: IMotionListener) => {
  if (typeof listener === 'function') {
    const timer = window.setTimeout(listener, 0);

    return () => {
      window.clearTimeout(timer);
    }
  }

  return noop;
}

// 生成 transition 或者 animation 的管理函数
function getMotionObserver(type: string) {
  return (el: HTMLElement, listener: IMotionListener, options: IAddMotionListenerOptions = false): IOffMotionListener => {
    if (hasMotionEvent) {
      // 获取当前ES环境中 transition 或 animation 对应的事件名称
      type = (lowPrefixer ? (lowPrefixer + type) : type.toLowerCase())
      el.addEventListener(type as any, listener, options)
      return () => {
        el.removeEventListener(type as any, listener, options)
      }
    }
    return fakeHandleMotionEvent(listener)
  }
}

/**
 * @example
 *     Motion.motion(
 *      function onStart() {
 *        el.classList.add(className);
 *        return el
 *      },
 *      function onEnd(el) {
 *        el.classList.remove(className);
 *        el.classList.remove(activeClassName);
 *     });
 */
export namespace Motion {
  export const onAnimationEnd = getMotionObserver('AnimationEnd');
  export const onAnimationStart = getMotionObserver('AnimationStart');
  export const onTransitionEnd = getMotionObserver('TransitionEnd');
  export const onTransitionStart = getMotionObserver('TransitionStart');
  export const getTransitionDelay = (el: HTMLElement) => getMotionTimeStyle(el, 'transition-delay');
  export const getTransitionDuration = (el: HTMLElement) => getMotionTimeStyle(el, 'transition-duration');
  export const getAnimationDelay = (el: HTMLElement) => getMotionTimeStyle(el, 'animation-delay');
  export const getAnimationDuration = (el: HTMLElement) => getMotionTimeStyle(el, 'animation-duration');
  export const getTransitionTimeout = (el: HTMLElement) => getTransitionDelay(el) + getTransitionDuration(el);
  export const getAnimationTimeout = (el: HTMLElement) => getAnimationDelay(el) + getAnimationDuration(el);
  export const getMotionTimeout = (el: HTMLElement) => {
    // 获取当前元素的动画持续时间
    if (hasMotionEvent) {
      const transitionTimeout = getTransitionTimeout(el);
      const animationTimeout = getAnimationTimeout(el);

      return Math.max(transitionTimeout, animationTimeout);
    }

    return 0;
  }
  export const motion = <T = HTMLElement>(onStart: IMotionOnStart<T>, onEnd: IMotionOnEnd<T>, both: boolean = false): IMotionAbortHandler => {
    // 绑定 transition end 事件处理
    let timer: number | null;
    const listenEnd = (e: IMotionEvent | null = null) => {
      if (e && e.target !== el) {
        return;
      }

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      offAnimationEnd ? offAnimationEnd() : null;
      offTransitionEnd();
      onEnd(el);
    };

    const el = onStart instanceof HTMLElement ? onStart : onStart();
    const offAnimationEnd = both ? onAnimationEnd(el, listenEnd) : null;
    const offTransitionEnd = onTransitionEnd(el, listenEnd);
    const timeout = getMotionTimeout(el);

    if (timeout >= 0) {
      timer = setTimeout(listenEnd, timeout);
    }

    return () => {
      listenEnd();
    }
  }
  // end
}