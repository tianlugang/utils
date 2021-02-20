/**
 * 指定的对象`obj`是否为window对象
 * @param {*} obj
 */
export const isWindow = (obj: any) => obj instanceof Window || obj !== null && obj !== window && obj === obj.window
