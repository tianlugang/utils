interface IArrayEachCallback<T> {
    (value: T, index: number, array: T[]): boolean | undefined
}

/**
 * 数组遍历
 * @param {array} array
 * @param {function} callback 
 */
export const forEach = <T = any>(array: T[], callback: IArrayEachCallback<T>) => {
    loop: for (let i = 0; i < array.length; i++) {
        switch (callback(array[i], i, array)) {
            case false: break loop;
            case true: break;
            default: break;
        }
    }
}