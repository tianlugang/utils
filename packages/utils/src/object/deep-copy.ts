/**
 * [ 深拷贝]
 * @param  {[Object]} obj [要拷贝的对象]
 * @return {[Object]}     [拷贝出的新的对象]
 */
export function deepCopy(obj: any): any {
    let copy: any;

    switch (typeof obj) {
        case 'number':
        case 'string':
        case 'boolean':
            copy = obj;
            break;
        case 'object':
            if (obj === null) {
                copy = null;
            } else if (Array.isArray(obj)) {
                copy = obj.map(item => deepCopy(item))
            } else {
                copy = {};
                for (const k in obj) {
                    copy[k] = deepCopy(obj[k]);
                }
            }
            break;
        default:
            break;
    }

    return copy;
}