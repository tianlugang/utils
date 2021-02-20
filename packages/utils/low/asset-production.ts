export default function (assetJson, prefix) {
    if (assetJson === null || 'object' !== typeof assetJson) {
        throw new Error('[asset-development] The parameter must be an object type.');
    }
    if (prefix === '' || 'string' !== typeof prefix) {
        prefix = '/static/';
    }
    const cached = {};

    return function (arr) {
        arr = [].concat(arr);
        const cacheKey = arr.join('-');

        if (Reflect.has(cached, cacheKey)) {
            return cached[cacheKey];
        }

        if (arr.indexOf('read') === -1) {
            arr.push('style');
        }

        const result = {
            compat: [].concat(assetJson.compat).map(v => prefix + v)
        };

        for (const name of arr) {
            if (Reflect.has(assetJson, name)) {
                const asset = assetJson[name];

                for (const kind in asset) {
                    const kindAsset = [].concat(asset[kind]).map(v => prefix + v);

                    if (Reflect.has(result, kind)) {
                        result[kind] = result[kind].concat(kindAsset);
                    } else {
                        result[kind] = kindAsset;
                    }
                }
            }
        }
        return cached[cacheKey] = result;
    }
}