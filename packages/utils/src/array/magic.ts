/**
 * 创建一个可以用负索引调用的数组
 * @returns {Array}
 */
export function magic<T = any>(array: T[]) {
    return new Proxy(array, {
        get(array, prop, receiver) {
            let index = Number(prop);

            if (index < 0) {
                prop = String(array.length + index);
            }

            return Reflect.get(array, prop, receiver);
        }
    });
}