export const ownKeys = (object: object, enumerableOnly: boolean = true) => {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
        let symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function (sym) {
                var descriptor = Object.getOwnPropertyDescriptor(object, sym);

                return descriptor ? descriptor.enumerable : false;
            });
        }

        keys.push.apply(keys, symbols as any);
    }

    return keys;
}
