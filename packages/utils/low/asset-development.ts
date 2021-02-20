export default function (assets) {
  if (!assets || 'object' !== typeof assets) {
    throw new Error('[ssr.asset] Assets must be an object.');
  }

  return function get(...args) {
    const result = {
      js: [],
      css: []
    };

    for (const name of args) {
      if (Reflect.has(assetJson, name)) {
        result.js.push('/' + assetJson[name])
      }
    }

    return result;
  }
}
