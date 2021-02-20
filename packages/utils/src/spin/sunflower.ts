import { generate } from '../array/generate';
import { noop } from '../base';
import { toPositiveInt } from '../number/to-positve-int';

/** 
 * @param {HTMLCanvasElement} cvs 
 * @param {Object} opt 
 * 
 */
interface ISunflowerOptions {
  block: number// 花瓣的个数
  height: number// 花瓣的高度
  width: number // 花瓣的宽度
  time: number // 转动延迟时间
  init: number // 初始角度
  diff: number // 花瓣根部到圆心的距离
  rgb: string //花瓣颜色
  bgColor: string// 背景色
}
export const sunflower = (cvs: HTMLCanvasElement, opt: ISunflowerOptions) => {
  const ctx = cvs.getContext("2d");

  if (ctx == null) {
    return noop;
  }

  const block = toPositiveInt(opt.block, 6);
  const height = toPositiveInt(opt.height, 4);
  const width = toPositiveInt(opt.width, 2);
  const time = toPositiveInt(opt.time, 100);
  const radius = toPositiveInt(opt.init, 2);
  const diff = toPositiveInt(opt.diff, 2);
  const rgb = typeof opt.rgb === 'string' ? opt.rgb : '0,123,255';
  const bgColor = typeof opt.bgColor === 'string' ? opt.bgColor : 'transparent';

  const dx = height * 6;
  const dy = height * 6;

  const ox = dx / 2;
  const oy = dy / 2;

  const ry1 = dx / 2 - height * 2;
  const ry2 = dx / 2 - height - diff;
  const rx2 = width / 2;
  const style = generate(block, i => 'rgba(' + rgb + ',' + +(i / block) + ')');

  let stop = false;
  let timer: ReturnType<typeof setTimeout>;
  const start = function (radius: number) {
    if (stop) return;
    ctx.fillStyle = bgColor;
    ctx.rotate(Math.PI * 2 / block);
    for (var i = 1; i <= block; i++) {
      ctx.rotate(Math.PI * 2 / block);
      ctx.beginPath();
      ctx.fillStyle = style[i]
      ctx.arc(0, ry1, rx2, 0, Math.PI, true);
      ctx.arc(0, ry2, rx2, Math.PI, 0, true);
      ctx.closePath();
      ctx.fill();
    }

    timer = setTimeout(function () {
      ctx.clearRect(-ox, -oy, dx, dy);
      radius >= block ? radius = 1 : radius += 1;
      start(radius);
    }, time);
  }

  cvs.height = dy;
  cvs.width = dx;
  ctx.translate(ox, oy);
  start(radius);

  return function () {
    stop = true;
    if (timer) clearTimeout(timer);
  };
}
