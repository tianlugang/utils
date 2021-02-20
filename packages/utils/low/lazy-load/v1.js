import {
  noop
} from '../web-js/src/utils/noop';
import {
  thrower
} from '../web-js/src/utils/thrower';
import {
  loadImage
} from '../web-js/src/utils/load-image';
import {
  addClass
} from './add-class';
import {
  removeClass
} from '../web-js/src/utils/rm-class';
import './w3c-intersection-observer'; // 全局，覆盖原生的 IntersectionObserver

/**
 * 用例:
 * `<img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy-image">`
 * 
 * 说明:
 * 初始时，须要懒加载的图片区不在视口之内，因此无需图像占位
 * @param selector 须加载的图像目标的类名，默认: .lazy-image
 * @param attribute 存储图片真实路径的属性名，必须是 .lazy-image 元素的属性，须HTML5数据属性规范，默认: data-src
 * @param loading 图片加载过程中的 loading ，必须是一个有效的 css 类名，默认: .lazy-loading
 * @param onerror 某个图片加载失败时的处理函数，传出了懒加载对象，onerror(elem) 
 * @param imgUseBackgroundImage 若懒加载对象是一个img对象，是否将加载成功的图像设置为其背景图片，默认: true
 **/
export function lazyLoadImage(opts) {
  if ('object' !== typeof opts) {
    return thrower('[lazyLoadImage Exception] Invalid Options, It has to be an object.');
  }

  const {
    DEFAULT
  } = lazyLoadImage;
  const selector = 'string' === typeof opts.selector ?
    opts.selector :
    DEFAULT.selector;
  const attribute = 'string' === typeof opts.attribute ?
    opts.attribute :
    DEFAULT.attribute;
  const loading = 'string' === typeof opts.loading ?
    opts.loading :
    DEFAULT.loading;
  const onerror = 'function' === typeof opts.onerror ?
    opts.onerror :
    DEFAULT.onerror;
  const imgUseBackgroundImage = Boolean(opts.imgUseBackgroundImage) || DEFAULT.imgUseBackgroundImage;

  // 获取图像元素
  const elements = document.querySelectorAll(selector);

  // 创建Observer
  const observer = new window.IntersectionObserver(onEntries, {
    threshold: [0.5]
  });

  // 打开监听器
  elements.forEach(function (elem) {
    observer.observe(elem)
  });

  // 元素进入视图
  function onEntries(entries) {
    entries.forEach(function (entry, index) {
      const intersectionRatio = entry.intersectionRatio;

      if (intersectionRatio > 0) {
        const elem = entry.target;
        const src = elem.getAttribute(attribute);

        // 添加loading
        addClass(elem, loading);
        // 读取图片
        loadImage(src, function (flag) {

          // 当图片加载成功时, flag: true
          if (flag) {
            if (elem.tagName !== "IMG" || imgUseBackgroundImage) {
              elem.style.backgroundImage = "url('" + src + "')";
            } else {
              elem.src = src;
            }

            // 关闭监听器
            observer.unobserve(elem);
          } else {
            onerror(elem);
          }

          // 移除loading
          removeClass(elem, loading);
        });
      }
    });
  }
}

// 默认的配置项
lazyLoadImage.DEFAULT = {
  selector: '.lazy-image',
  attribute: 'data-src',
  loading: 'lazy-loading',
  throttle: 150,
  onerror: noop,
  imgUseBackgroundImage: true
}
