const CACHE = new Map(); // 正则的编译结果缓存
// js内置的正则的 flag, JavaScript的原生flags
// g: global 
// i: ignoreCase 
// m: multiline 
// u: unicode 
// y: sticky 
const flags = ['g', 'i', 'm', 'u', 'y'];
const DEFAULT = { // 默认配置项
  cache: false, // --------------- 是否缓存
  throwError: true, // --------------- 是否抛出错误
  strict: false, // --------------- 严格的开合规则 /^ ... $/
  strictStart: true, // ---------- 严格的开头 /^ ... /
  strictEnd: true, // ------------ 严格的开结尾 / ... $/
  flags: '', // ----------------- 标志 g m i
  negate: false, // -------------- 排除型字符组 ， 与脱字符 “^” 一起使用
  strictNegate: false, // -------- 严格模式下的排除型字符组
  strictNegateEnd: '+' // -------- 排除型字符组的匹配次数，正则量词，有*或+或?或{n}或{n,}或{n,m}共6种。
};

/**
 * 获取正确的 flag
 * @param {string} flag 
 */
function getVaildFlags(flag) {
  if (typeof flag !== 'string') {
    return '';
  }

  return flag.split('').filter(char => {
    if (flags.indexOf(char) > -1) {
      return char;
    }

    return false;
  }).join('');
}


/**
 * 合并用户参数
 *
 * @param {object} config
 * @returns {object} 
 */
function getOptions(config) {
  const option = Object.assign({}, DEFAULT);

  if (typeof config === 'object' && config) {
    option.cache = config.cache === true;
    option.strict = config.strict === true;
    option.throwError = config.throwError === true;
    option.flags = getVaildFlags(config.flags);

    if (option.strict) {
      option.strictStart = config.strictStart === true;
      option.strictEnd = config.strictStart === true;
    } else {
      option.strictStart = false;
      option.strictEnd = false;
    }

    option.strictStart = option.strictStart ? '^' : '';
    option.strictEnd = option.strictEnd ? '$' : '';

    option.negate = config.negate === true;
    if (option.negate) {
      option.strictNegate = config.strictNegate === true;
      option.strictNegateEnd = config.strictNegateEnd || '+';
    } else {
      option.strictNegate = false;
      option.strictNegateEnd = '';
    }
  }

  return option;
}

/**
 * 编译成正则表达式
 *
 * @param {any} pattern
 * @param {DEFAULT} options
 * @returns {RegExp}
 */
function toRegex(pattern, options = null) {
  if (pattern instanceof RegExp) {
    return pattern;
  }

  if (Array.isArray(pattern)) {
    pattern = pattern.join('|');
  } else {
    switch (typeof pattern) {
      case 'number':
      case 'symbol':
      case 'bigint':
      case 'boolean':
        pattern = pattern.toString();
        break;
      default:
        break;
    }
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('regex body is number, string, boolean, string-array or regex type.');
  }

  options = getOptions(options);

  let key = pattern + options.flags;
  if (options.cache) {
    // 优先获取缓存
    if (CACHE.has(key)) {
      return CACHE.get(key);
    }
  }
  let regex = null;
  try {
    // 排除型字符组
    if (options.negate) {
      let str = '';

      if (options.strictNegate === true) {
        /*
        	用圆括号将所有选择项括起来，相邻的选择项之间用|分隔。
        	但用圆括号会有一个副作用，是相关的匹配会被缓存，
        	此时可用?:放在第一个选项前来消除这种副作用。

        	非捕获元 ?: ?= ?!
        	?= 为正向预查，在任何开始匹配圆括号内的正则表达式模式的位置来匹配搜索字符串，
        	?! 为负向预查，在任何开始不匹配该正则表达式模式的位置来匹配搜索字符串。

        	(?:' + pattern + ') ==> 匹配 pattern 但不获取匹配结果 , 消除()的缓存效果
        	(?! ... ) ==> 在任何不匹配 pattern 的字符串开始处匹配查找字符串
        */
        str = '(?:(?!(?:' + pattern + ')).)' + options.strictNegateEnd;
        // str = '(?:(?!(?:' + pattern + ')))' + options.strictNegateEnd;
      } else {
        str = '(?:(?!^(?:' + pattern + ')$).)' + options.strictNegateEnd;
        // str = '(?:(?!^(?:' + pattern + ')$))' + options.strictNegateEnd;
      }
      pattern = options.strictStart + str + options.strictEnd;
    } else {
      pattern = options.strictStart + '(?:' + pattern + ')' + options.strictEnd;
    }

    regex = new RegExp(pattern, options.flags);
  } catch (err) {
    if (options.throwError === true) {
      err.cackle = key;
      err.pattern = pattern;
      err.options = options;
      throw err;
    }

    try {
      regex = new RegExp('^' + pattern.replace(/(\W)/g, '\\$1') + '$');
    } catch (err2) {
      regex = /.^/;
    }
  }

  // 写入缓存
  if (options.cache) {
    CACHE.set(key, regex);
  }

  return regex;
}

/**
 * 新增flags，如果JavaScript新增了flags，可使用该方法追加，
 * 也可以修改此包的源码，因为我并没有找到能获取JavaScript原生获取flags的方法
 * @param {string} flag 
 */
function addValidFlag(flag) {
  if (typeof flag !== 'string') {
    throw new TypeError('flag(Param) must be a valid string.');
  }

  if (flags.includes(flag)) {
    return true;
  }

  try {
    new RegExp('', flag);
    flags.push(flag);

    return true;
  } catch (err) {
    throw err;
  }
}

/**
 * 清除缓存
 * @param {string} key 
 */
function delCache(key) {
  if (key) return CACHE.delete(key);
  CACHE.clear();
}
module.exports = {
  addValidFlag,
  toRegex,
  delCache
};
