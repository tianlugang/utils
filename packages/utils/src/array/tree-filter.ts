type ITreeObject = Record<string, any>
type ITreeFilter<T> = {
    (tree: T, depth: number): T
}

/**
 * 数组tree过滤
 * @param {Array} data 
 * @param {Function} filter 
 * @param {Object} options 
 */
export function treeFilter<T extends ITreeObject>(data: T[], filter: ITreeFilter<T>, key: keyof T = 'children') {
    let children = data || [];
    let result = [];
    let depth = 0;

    do {
        let filtered = children.filter(item => filter(item, depth));
        if (filtered.length === 0) {
            break;
        }

        let foundItem = filtered[0];
        result.push(foundItem);
        children = foundItem[key] || [];
        depth += 1;
    } while (children.length > 0);

    return result;
}