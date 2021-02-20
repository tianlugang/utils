import { noop } from '../base';
import { toPositiveInt } from '../number/to-positve-int';

interface ITrackballOptions {
  size: number // 轨迹圆的直径 diameter
  speed: number // 移动圆移动角度
  offset: number // 移动圆移动基准角度
  step: number // 移动圆半径的坍缩值
  block: number // 移动圆的个数
  rgb: string // 移动圆的填充色
  bgColor: string// 背景色
}

interface ITrackballAbort {
  (): void
}

export const canvasTrackball = (cvs: HTMLCanvasElement, opt: ITrackballOptions): ITrackballAbort => {
  const ctx = cvs.getContext("2d");

  if (ctx == null) {
    return noop
  }

  const R = toPositiveInt(opt.size, 24);
  const speed = toPositiveInt(opt.speed, 10);
  const step = toPositiveInt(opt.step, 0.5);
  const offset = Number.isFinite(opt.offset) ? opt.offset : -30;
  const block = toPositiveInt(opt.block, 10);
  const rgb = typeof opt.rgb === 'string' ? opt.rgb : '0,123,255';
  const bgColor = typeof opt.bgColor === 'string' ? opt.bgColor : 'transparent';

  const C = R / 2;
  const maxR = R / block;
  const rr = C - maxR - 2;
  const max = Math.ceil(maxR / step);

  const angle = new Array(max);
  const style = new Array(max);
  const r = new Array(max);

  let timer: ReturnType<typeof setTimeout>
  let x, y, i;

  for (i = max - 1; i >= 0; i--) {
    r[i] = maxR - step * i;
    angle[i] = r[i] / rr / (Math.PI / 180) + i * offset;
    style[i] = 'rgba(' + rgb + ',' + (1 - 0.15 * i) + ')';
  }

  cvs.height = R;
  cvs.width = R;
  ctx.translate(C, C);
  timer = setInterval(function draw() {
    ctx.fillStyle = bgColor;
    ctx.clearRect(-C, -C, R, R);

    for (i = max - 1; i >= 0; i--) {
      x = rr * Math.cos(angle[i] * Math.PI / 180);
      y = rr * Math.sin(angle[i] * Math.PI / 180);

      ctx.beginPath();
      ctx.fillStyle = style[i];
      ctx.arc(x, y, r[i], 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fill();
      angle[i] += speed;
    }
  }, 100);

  return () => {
    if (timer) {
      clearInterval(timer);
    }
  };
}
