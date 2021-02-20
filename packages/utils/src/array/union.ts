/**
 * 数组连接
 * @param {Array} init
 * @param {...}  
 */
export function union<T = any>(init: T[]) {
  if (!Array.isArray(init)) {
    throw new TypeError('arr-union expects the first argument to be an array.');
  }

  let len = arguments.length;
  let i = 0;

  while (++i < len) {
    let arg = arguments[i];
    if (!arg) continue;

    if (!Array.isArray(arg)) {
      arg = [arg];
    }

    for (let j = 0; j < arg.length; j++) {
      let el = arg[j];

      if (init.indexOf(el) >= 0) {
        continue;
      }

      init.push(el);
    }
  }

  return init;
}