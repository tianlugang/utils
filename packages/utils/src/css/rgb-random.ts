/**
 * 生成随机 rgb 颜色
 * @example
 *    var i = 1
 *    var t = setInterval(function () {
 *      var color = rgbGen()
 *      console.log(color)
 *      document.body.style.backgroundColor = color
 *      i++
 *      if (i > 100) {
 *        clearInterval(t)
 *      }
 *    }, 1000)
 */

let random = function (w: number, z: number, m: number) {
  z = ((36969 * (z & 65535)) + (z >> 16)) & m;
  w = ((18000 * (w & 65535)) + (w >> 16)) & m;
  let result = ((z << 16) + w) & m;
  result /= 4294967296;

  return (result * 100 + 1).toString();
}

export function getRandomRgb(w: number = 599, z = 987654321, m = 0xffffffff) {
  const r = Math.max(parseInt(random(w, z, m), 10) % 256, 1);
  const g = Math.max(parseInt(random(w, z, m), 10) % 256, 1);
  const b = Math.max(parseInt(random(w, z, m), 10) % 256, 1);

  return `rgb(${r},${g},${b})`;
}
