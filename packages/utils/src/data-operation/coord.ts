export type ICoord<X = any, Y = any> = {
  x: X
  y: Y
}

export namespace Coord {
  // 是否为相同坐标
  export const isEqual = (c1: ICoord, c2: ICoord) => {
    return c1.x === c2.x && c1.y === c2.y;
  }
}
