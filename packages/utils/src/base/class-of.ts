const oToString = Object.prototype.toString

export function classOf(obj: any) {
    return oToString.call(obj)
}
