const doc = document
const body = doc.body
const html = doc.documentElement
const back = doc.compatMode == 'BackCompat' ? body : html;

export namespace Page {
  // 获取页面宽度
  export const width = () => Math.max(html.scrollWidth, body.scrollWidth, back.clientWidth)

  // 获取页面高度
  export const height = () => Math.max(html.scrollHeight, body.scrollHeight, back.clientHeight)

  /**
   * 获取页面可视区的高度
   * 在混杂模式（BackCompat）下，ie10+的浏览器，
   * 三者（`window.innerHeight` `document.documentElement.clientHeight` `document.body.clientHeight`）的值都是相同的
   * innerHeight  可以视为是包含滚动条尺寸的视口，
   * documentElement.clientHeight  可以视为不包含滚动条尺寸的视口，两者在存在滚动条的方向上相差17px
   */
  export const vHeight = () => body.clientHeight;

  /**
   * 获取页面可视宽度
   * 在混杂模式（BackCompat）下，ie10+的浏览器，
   * 三者（`window.innerWidth` `document.documentElement.clientWidth` `document.body.clientWidth`）的值都是相同的
   */
  export const vWidth = () => body.clientWidth

  // 获取页面scrollLeft
  export const scrollLeft = () => html.scrollLeft || body.scrollLeft

  // 获取页面scrollTop
  export const scrollTop = () => html.scrollTop || body.scrollTop

  /**
   * 滚动到顶部
   * 使用document.documentElement.scrollTop 或 document.body.scrollTop 获取到顶部的距离，从顶部
   * 滚动一小部分距离。使用window.requestAnimationFrame()来滚动。
   */
  export function scroll(dir: 'top' | 'left' = 'top', dest: number = 0) {
    let src = 0, left = 0, top = 0;

    if (dir === 'top') {
      src = scrollTop()
      top = src - src / 8
    } else {
      src = scrollLeft()
      left = src - src / 8
    }

    if (src > dest) {
      window.requestAnimationFrame(() => {
        scroll(dir, dest);
      });
      window.scrollTo(top, left);
    }
  }

  // 元素是否在视口中
  export function inViewport(el: HTMLElement) {
    if (!el.getBoundingClientRect) {
      return false;
    }
    const rect = el.getBoundingClientRect();

    return rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight);
  }

}