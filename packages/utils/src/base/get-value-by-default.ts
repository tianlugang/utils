const toString = Object.prototype.toString

export function getValueByDefault<T=any, A= any>(act: A, def: T) {
    return toString.call(act) === toString.call(def) ? act : def
}
