const filters = {
    // window处理
    $1: [/\r\n/gm, "\n"],

    // 移除首行空格
    $2: [/^[\t ]*/gm, ""],

    // 移除第一个 '*'
    $3: [/^\*[\t ]?/, ""],

    // 移除最后一个空格
    $4: [/[\t ]$/, ""],

    // 移除首行的 '*'
    $5: [/^\*[\t ]?/gm, ""],

    // 自动插入 @desc
    $6: comment => {
        if (comment.charAt(0) !== "@") {
            comment = `@desc ${comment}`;
        }
        return comment;
    },

    // 移除尾部的空格
    $7: [/[\t ]*$/, ""],

    // 转码代码中的 @
    $8: [/```[\s\S]*?```/g, match => match.replace(new RegExp('@', 'g'), "\\ESCAPED_AT\\")],

    // 自动为无文本标签插入文本 (e.g. @interface)
    $9: [/^[\t ]*(@\w+)$/gm, "$1 \\TRUE"],

    // 插入分隔符 (\\Z@tag\\Ztext)
    $10: [/^[\t ]*(@\w+)[\t ](.*)/gm, "\\Z$1\\Z$2"],

    // 移除上文插入的 占位 `true`
    $11: ["\\TRUE", ""],

    // 恢复上文替换的 `@`
    $12: [/\\ESCAPED_AT\\/g, "@"],

    // 移除开头的第一个 `\n`
    $13: [/^\n/, ""],

    // 移除尾部的换行
    $14: [/\n*$/, ""],

    // 插入分隔符 (@tag\\Ztext)
    $15: [/^[\t ]*(@\w+)[\t ](.*)/gm, "$1\\Z$2"]
};

/**
 * 文档注释分割
 * @member {array<RegExp|function>} middleware - 中间件
 */
class Segment {

    constructor() {
        this.handlers = [
            filters.$1, filters.$2, filters.$3, filters.$4, filters.$5,
            filters.$6, filters.$7, filters.$8, filters.$9, filters.$10
        ];
        this.formatter = [filters.$11, filters.$12, filters.$13, filters.$14];
    }

    /**
     * @param {object} options - 配置项
     * @param {array}  options.middleware - 传递给分割项的中间件
     */
    setOptions() {

    }

    /**
     * 逐段分割录入的文档注释
     * @param {string} comment - 文档注释的内容
     * @returns {array<string>} 分割成段的数组
     */
    spilt(comment) {
        return Segment.reduce(this.handlers, comment).split("\\Z");
    }

    /**
     * 逐层格式化`spilt`处理过的字符串
     * @param {string} value
     * @returns {string}
     */
    format(value) {
        return Segment.reduce(this.formatter, value);
    }

    /**
     * 字符串合成
     * @param {array} middleware 中间件
     * @param {string} value -字符串
     */
    static reduce(middleware, value) {
        return middleware.reduce((value, handler) => {
            if (typeof handler === "function") {
                return handler(value);
            }

            return value.replace(handler[0], handler[1]);
        }, value);
    }
}

module.exports = Segment;