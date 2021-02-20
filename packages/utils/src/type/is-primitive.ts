
export const isPrimitive = (any: any) => {
    if (any === null) return true
    switch (typeof any) {
        case 'boolean':
        case 'number':
        case 'string':
        case 'symbol':
        case 'undefined':
            return true
        default:
            break;
    }

    return false
}
