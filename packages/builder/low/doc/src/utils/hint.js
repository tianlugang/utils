const { logger, color, LikeArray } = require('../utils');
const l10n = require('../../../l10n/l10n');
const collectors = {
  // 错误集
  error: {
    data: new LikeArray(),
    theme: 'red'
  },
  // 警告集
  warning: {
    data: new LikeArray(),
    theme: 'yellow'
  },
  // promise 警告与错误
  promise: {
    data: new Map(),
    theme: 'blue'
  },
  *[Symbol.iterator]() {
    yield collectors.error;
    yield collectors.warning;
    yield collectors.promise;
  }
};

/**
 * 处理全局 `uncaughtException` 事件
 * @param {Error} reason
 * @listens process.uncaughtException
 * @memberof Exception
 * @access private
 */
function _uncaughtException(reason) {
  if (reason.kind) {

    collectors.warning.data.push(reason);
  } else {

    collectors.error.data.push(reason);
  }
}

/**
 * 处理全局 `unhandledRejection` 事件
 * @param {Error} reason 错误原因
 * @param {promise} promise
 * @memberof Exception
 * @access private
 */
function _unhandledRejection(reason, promise) {
  collectors.promise.data.set(promise, reason);
}

/**
 * 处理全局 `rejectionHandled` 事件, 如果事件`promise rejected`被处理掉了，就从收集容器里移除出去
 * @param {Promise} promise
 * @memberof Exception
 * @access private
 */
function _rejectionHandled(promise) {
  collectors.promise.data.delete(promise);
}

/**
 * @desc 错误处理类
 */
class Exception {
  constructor() {
    l10n.set('exception', Exception.l10n);
    this._startObserver();
  }

  _startObserver() {
    process.on('uncaughtException', _uncaughtException);
    process.on('unhandledRejection', _unhandledRejection);
    process.on("rejectionHandled", _rejectionHandled);

    const capture = () => {
      clearTimeout(capture.timer);

      if (this.has()) {
        this.throw();
      }

      capture.timer = setTimeout(capture, 50);
    }

    capture.timer = setTimeout(capture, 50);
  }

  /**
   *设置配置项
   * @param {object} options
   */
  setOptions(options) {
  }

  /**
   * 是否存在异常
   */
  has() {
    for (let { data } of collectors) {
      if (data.length || data.size) {
        return true;
      }
    }
  }

  /**
   * 抛出异常
   */
  throw() {
    for (let { data, theme } of collectors) {
      if (data.length || data.size) {
        output.call(this, data, theme);
      }
    }

    function output(data, theme) {
      logger.out();

      data.forEach(ex => {
        if (typeof ex === 'string') {
          return logger.out(color`${theme}${ex}`);
        }

        const keys = Object.keys(ex);

        logger.out(color`${theme}${ex.stack}`);
        if (keys.length) {

          logger.out(color`${theme}Exception:`);
          keys.forEach(key => {
            logger.out(color`    ${theme}${key} ${'white'}${ex[key]}`);
          });
        }
      });

      data.clear();
    }
  }

  /**
   * 自定义一个错误并收集
   * @param {string} name 可选值 错误名称
   * @param {string} message 错误信息
   * @param {string} fileName 错误文件的行号
   * @param {number} lineNumber 错误文件行号
   */
  error(name, message, fileName, lineNumber) {
    if (typeof name !== 'string') {
      throw new TypeError(l10n.get('exception.isNotString', 'Error.name'));
    }

    if (typeof message !== 'string') {
      throw new TypeError(l10n.get('exception.isNotString', 'Error.message'));
    }

    collectors.error.data.push([
      name,
      '   @(message)    ' + message,
      '   @(fileName)   ' + (fileName || 'unknown'),
      '   @(lineNumber) ' + (lineNumber || 'unknown')
    ].join('\n'));
  }

  /**
   * 实例化一个警告并收集
   * @param {string} name 可选值 错误名称
   * @param {string} message 错误信息
   * @param {string} fileName 错误文件的行号
   * @param {number} lineNumber 错误文件行号
   */
  warning(name, message, fileName, lineNumber) {
    if (typeof name !== 'string') {
      throw new TypeError(l10n.get('exception.isNotString', 'Warning.name'));
    }

    if (typeof message !== 'string') {
      throw new TypeError(l10n.get('exception.isNotString', 'Warning.message'));
    }

    collectors.warning.data.push([
      name,
      '   @(message)    ' + message,
      '   @(fileName)   ' + (fileName || 'unknown'),
      '   @(lineNumber) ' + (lineNumber || 'unknown')
    ].join('\n'));
  }
}

// 语言本地化
Exception.l10n = {
  default: {
    isNotString: '$1 is not a string.'
  },
  zh_CN: {
    isNotString: '$1 不是一个有效的字符串'
  }
};

module.exports = new Exception();
