export namespace Circle {
  /**
   * 原型分部
   * @param {number} count 圆的个数
   * @param {number} radius 所在所外圈圆的半径
   * @param {functtion(x,y,z,i)} callback 返回当前坐标  
   */
  export function circular(count: number, radius: number, callback: (x: number, y: number, z: number, i: number) => void) {
    var deg = 360 / count * (Math.PI / 180);

    for (var index = 0; index < count; index++) {
      var m = (count % 2) === 0 ? (count / 2) : (Math.floor(count / 2) + 1);

      callback(
        radius + Math.sin(deg * index) * radius - 40,
        radius - Math.cos(deg * index) * radius - 40,
        index < m ? (index + 1) : (count - index),
        index
      );
    }
  }

  /**
   * 椭圆分部
   * @param count 
   * @param offset 
   * @param left 
   * @param top 
   * @param width 
   * @param height 
   * @param callback 
   */
  export function ellipse(
    count: number, offset = 0.05,
    left: number, top: number,
    width: number, height: number,
    callback: (x: number, y: number, z: number, a: number, i: number) => void
  ) {
    for (let i = 0; i < count; i++) {
      var rad = 2 * Math.PI * i / count + offset;

      var x = width * Math.cos(rad) + left;
      var y = height * Math.sin(rad) + top;
      var z = Math.sin(rad) > 0 ? 3 : 2;

      var p = (Math.sin(rad) < 0) ?
        2 * width - Math.abs(width * Math.cos(rad)) :
        width * Math.abs(Math.cos(rad));
      var a = (100 - 40 * p / width + 20) / 100;

      callback(x, y, z, a, i);
    }
  }
}