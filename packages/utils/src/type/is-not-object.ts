// return Object.prototype.toString.call(o) === '[object Object]'
export const isNotObject = (obj: any) => obj && (typeof obj !== 'object' || Array.isArray(obj))
