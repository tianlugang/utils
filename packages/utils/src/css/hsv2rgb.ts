export const HSV2RGB = (h: number, s: number, v: number) => {
  let r!: number;
  let g!: number;
  let b!: number;
  let i!: number;
  let f!: number;
  let p!: number;
  let q!: number;
  let t!: number;

  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }
  const hr = Math.floor(r * 255).toString(16);
  const hg = Math.floor(g * 255).toString(16);
  const hb = Math.floor(b * 255).toString(16);

  return '#' + (hr.length < 2 ? '0' : '') + hr + (hg.length < 2 ? '0' : '') + hg + (hb.length < 2 ? '0' : '') + hb;
}
