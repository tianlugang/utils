type IQueueCallback<T> = {
    (value: T, index: number, queue: T[]): unknown
}

//  队列
export const queueFactory = <D = any>() => {
    const data: D[] = []
    const queue = {
        get size() {
            return data.length;
        },

        forEach(callback: IQueueCallback<D>) {
            for (let i = 0; i < data.length; i++) {
                callback(data[i], i, data)
            }
        },

        indexOf(value: D) {
            return data.findIndex(v => v === value);
        },

        has(value: D) {
            return data.includes(value);
        },

        append(value: D) {
            data.push(value);
        },

        prepend(value: D) {
            data.unshift(value);
        },

        remove(value: D) {
            const index = queue.indexOf(value);
            index > -1 && data.splice(index, 1);
        },

        clear() {
            data.length = 0;
        },
    }

    return queue;
}