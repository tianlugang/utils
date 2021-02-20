
/**
 * @desc 终端颜色
 */
const color = require('../../../src/terminal.color');

/**
 * @desc 终端日志
 */
const { Logger } = require('../../../src/terminal.print');
const logger = new Logger('[Doca]', { noColor: true });

/**
 * 计算百分比
 * @param {number} num 需要求百分比的数字
 * @param {number} precision 精度
 * @returns {string}
 * @memberof utils
 */
function percentage(num, precision = 2) {
    return (num * 100).toFixed(precision) + '%';
}

/**
 * 字符串等宽填充
 * @param {string} str 需要等宽的字符串
 * @param {number} max 字符串宽度
 * @param {string} sign 填充的字符
 * @memberof utils
 */
function padRight(str, max = 0, sign = ' ', ) {
    const diff = max - getStringWidth(str);

    return diff > 0 ? sign.repeat(diff) + str : str;
}

/**
 * 获取数字数组的最大值
 * @param {array<number>} arr 数字数组
 * @returns {number}
 * @memberof utils
 */
function getArrayMax(arr) {
    return Math.max.apply(null, arr);
}

/**
 * 获取字符串可视化的宽度
 * @param {string} str 
 * @memberof utils
 */
function getStringWidth(str) {
    let realLength = 0;

    for (let i = 0, len = str.length, charCode = -1; i < len; i++) {
        charCode = str.charCodeAt(i);
        realLength += charCode >= 0 && charCode <= 128 ? 1 : 2;
    }
    return realLength;
};


function noop() { };

class LikeArray extends Array {
    constructor() {
        super();
    }

    clear() {
        this.length = 0;
    }
}

/**
 * 通用工具类
 * @namespace utils
 */
const utils = {
    percentage,
    getStringWidth,
    getArrayMax,
    padRight,
    logger,
    color,
    noop,
    LikeArray
};

module.exports = utils;
