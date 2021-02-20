const oHasOwnProperty = Object.prototype.hasOwnProperty

export function hasOwnProperty(obj: any, prop: string | number | any) {
    return oHasOwnProperty.call(obj, prop)
}