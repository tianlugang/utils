// for in ===> Object
export function eachObject<T= any >(object: any, each: (item: T, name: string) => void) {
    for (let [name, item] of Object.entries<T>(object)) {
        each(item, name)
    }
}