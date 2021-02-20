var UID = Math.floor(Math.random() * 0x10000000000).toString(16);
var REGEXP_HOLDER = new RegExp('"@__(F|R|D)-' + UID + '-(\\d+)__@"', 'g');
var REGEXP_NATIVE = /\{\s*\[native code\]\s*\}/g;
var REGEXP_UNSAFE = /[<>\/\u2028\u2029]/g;
var ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};

function escapeUnsafeChars(unsafeChar) {
  return ESCAPED_CHARS[unsafeChar];
}

/**
 * 序列化
 * 
 * @param {object} obj 序列化对象
 * @param {object} options  序列化参数
 * @param {boolean} options.unsafe 设置为true，将不再开启XSS protection
 * @param {boolean} options.isJSON 序列化对象是纯JSON时，可开启此项，提高序列化速度
 * @param {number} options.space 在序列化结果中添加空格或缩进，保持良好的阅读性
 */
function serialize(obj, options) {
  options || (options = {});

  if (typeof options === 'number' || typeof options === 'string') {
    options = {
      space: options
    };
  }

  var functions = [];
  var regexps = [];
  var dates = [];

  function replacer(key, value) {
    if (!value) {
      return value;
    }

    var origValue = this[key];
    var type = typeof origValue;

    if (type === 'object') {
      if (origValue instanceof RegExp) {
        return '@__R-' + UID + '-' + (regexps.push(origValue) - 1) + '__@';
      }

      if (origValue instanceof Date) {
        return '@__D-' + UID + '-' + (dates.push(origValue) - 1) + '__@';
      }
    }

    if (type === 'function') {
      return '@__F-' + UID + '-' + (functions.push(origValue) - 1) + '__@';
    }

    return value;
  }

  var str;

  if (options.isJSON && !options.space) {
    str = JSON.stringify(obj);
  } else {
    str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
  }

  if (typeof str !== 'string') {
    return String(str);
  }

  if (options.unsafe !== true) {
    str = str.replace(REGEXP_UNSAFE, escapeUnsafeChars);
  }

  if (functions.length === 0 && regexps.length === 0 && dates.length === 0) {
    return str;
  }

  return str.replace(REGEXP_HOLDER, function (match, type, valueIndex) {
    if (type === 'D') {
      return "new Date(\"" + dates[valueIndex].toISOString() + "\")";
    }

    if (type === 'R') {
      return regexps[valueIndex].toString();
    }

    var fn = functions[valueIndex];
    var serializedFn = fn.toString();

    if (REGEXP_NATIVE.test(serializedFn)) {
      throw new TypeError('Serializing native function: ' + fn.name);
    }

    return serializedFn;
  });
}

/**
 * 反序列化
 * @param {string} serializedJavascript 
 */
function deserialize(serializedJavascript) {
  return eval('(' + serializedJavascript + ')');
}

module.exports = {
  serialize,
  deserialize
};
