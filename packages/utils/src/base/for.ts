
type IForCallback<T> = {
    (index: number, serial: number, array: T[]): T
}

export function forTo<T = any>(start: number, end: number, callback: IForCallback<T>) {
    let array: T[] = [];

    for (let i = start, index = 0; i < end; ++i, index = i - start) {
        array.push(callback(i, index, array));
    }

    return array;
}

export function forThrough<T = any>(start: number, end: number, callback: IForCallback<T>) {
    let array: T[] = [];

    for (let i = start, index = 0; i <= end; ++i, index = i - start) {
        array.push(callback(i, index, array));
    }

    return array;
}


// export function forEach(start: number, end: number, callback:) {
//     for (var index = start; index < length; index++) {
//         callback(index, length);
//     }
// }