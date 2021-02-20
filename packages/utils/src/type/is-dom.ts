// 是否为DOM元素 
export var isDOM = function (obj: any): boolean {
    isDOM = (typeof HTMLElement === 'object')
        ? function (obj: any) {
            return obj instanceof HTMLElement
        }
        : function (obj: any) {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
        }

    return isDOM(obj)
}
