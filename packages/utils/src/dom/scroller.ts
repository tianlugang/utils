import { raf } from '../bom/raf';
import { noop, never } from '../base';
function easeInOut(t: number, b: number, c: number, d: number) {
  const cc = c - b;
  t /= d / 2;

  if (t < 1) {
    return cc / 2 * t * t * t + b;
  }

  return cc / 2 * ((t -= 2) * t * t + 2) + b;
}
type IScrollTarget = HTMLElement | HTMLDocument | Window
type IScrollDir = 'scrollTop' | 'scrollLeft'
type IScrollContainerGetter = { (): IScrollTarget }
type IScrollToOption = {
  duration: number
  dir: IScrollDir
  container: IScrollTarget | IScrollContainerGetter
  onEnd(): void
  cancel(): boolean
}

const Window = window.Window
const wScrollTo = (el: Window, v: number, dir: IScrollDir) => {
  if (dir === 'scrollTop') {
    el.scrollTo(window.pageXOffset, v);
  }

  if (dir === 'scrollLeft') {
    el.scrollTo(v, window.pageYOffset);
  }
}

const dScrollTo = (el: HTMLDocument, v: number, dir: IScrollDir) => {
  el.documentElement[dir] = v
}

const eScrollTo = (el: HTMLElement, v: number, dir: IScrollDir) => {
  el[dir] = v
}

export namespace Scroller {
  export function get(target: IScrollTarget, dir: IScrollDir = 'scrollTop') {
    let result = 0;

    if (target instanceof Window) {
      result = target[dir === 'scrollTop' ? 'pageYOffset' : 'pageXOffset'];
    } else if (target instanceof Document) {
      result = target.documentElement[dir];
      if (typeof result !== 'number') {
        result = (target.ownerDocument || target).documentElement[dir];
      }

    } else if (target) {
      result = target[dir];
    }

    return result;
  }

  export const set = (el: IScrollTarget, value: number, dir: IScrollDir = 'scrollTop') => {
    el instanceof Window
      ? wScrollTo(el, value, dir)
      : el instanceof HTMLDocument
        ? dScrollTo(el, value, dir)
        : eScrollTo(el, value, dir);
  }

  export const to = (y: number = 0, {
    duration = 400,
    dir = 'scrollTop',
    container = () => window,
    cancel = never,
    onEnd = noop,
  }: Partial<IScrollToOption>) => {
    const el = typeof container === 'function' ? container() : container;
    const setScroll = el instanceof Window ? wScrollTo : el instanceof HTMLDocument ? dScrollTo : eScrollTo;

    const timeStart = Date.now();
    const prevValue = Scroller.get(el, dir);
    const frame = () => {
      const timeEnd = Date.now() - timeStart;
      const nextValue = easeInOut(timeEnd > duration ? duration : timeEnd, prevValue, y, duration);

      setScroll(el as any, nextValue, dir);

      if (timeEnd <= duration && cancel() !== true) {
        return raf(frame);
      }

      onEnd();
    };

    raf(frame);
  }
}
