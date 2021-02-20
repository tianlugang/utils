// return Object.prototype.toString.call(o) === '[object Object]'
export const isObject = (obj: any) => typeof (obj) === 'object' && obj !== null && !Array.isArray(obj)
