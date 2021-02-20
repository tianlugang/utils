/**
 * 颜色转16进制
 * @param {RGB} color -- rgb颜色
 * @returns {string}
 */
export function rgb216(color: string) {
  const rgba = /^rgba?\(([\s\S]*)\)$/;
  const exec = rgba.exec(color);

  if (exec) {
    return '#' + exec[1].split(/,/).map(v => {
      const val = parseInt(v);

      return val === 0 ? '00' : val.toString(16);
    }).join('');
  }

  return color;
}
