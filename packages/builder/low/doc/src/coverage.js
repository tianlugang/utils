w/**
 * @file 注释覆盖率统计
 */
const color = require('../../src/terminal.color');
const l10n = require('../../l10n/l10n');
const { percentage, padRight, getArrayMax, getStringWidth, logger } = require('./utils/index');

/**
 * @desc 注释覆盖率计算方法
 *   1. 行统计
 *   需要统计当前 文件行总数，代码行总数，注释行总数，空白行总数
 *   注释覆盖率 = (注释总行数 / 文件总行数) * 100
 *   代码与注释比 = (代码总行数 / 注释总行数)
 *
 *   2. 大小统计
 *   需要统计当前文件的大小，代码大小，注释大小
 *   注释覆盖率 = (注释大小 / 文件大小) * 100
 *   代码与注释比 = (代码大小 / 注释大小)
 */
class Coverage {
    constructor() {
        l10n.set('coverage', Coverage.l10n); // 注册本地化信息
        this.records = {}; // 记录
        this.stats = getRecord(); // 综合统计
        this.count = new Set(); // 声明一个计数器
    }

    /**
     * @param {object} options - 配置
     * @param {object} options.verbose - 是否输出到控制台F
     */
    setOptions({ coverage }) {
        this.options = Object.assign({}, coverage);
        this.options.verbose = !!this.options.verbose;
        this.feilds = l10n.getJson('coverage.feilds');
    }

    /**
     * 获取当前`path`对应的注释覆盖信息
     * @param {string} path - 当前文件的标识，默认是文件的路径
     * @returns {object:Record}
     * @throws {Error} 当前`path`指代的注释统计信息不存在
     */
    getRecord(path) {
        const record = this.records[path];

        if (record) return record;

        const message = l10n.get('coverage.idNotFound', path);

        throw new Error(message);
    }

    /**
     * 生成一个用于标记当前文件信息的标识,并且记入缓存
     * @param {string} path - 当前文件的标识，默认是文件的路径
     * @param {ASTNode} ast - js语法树
     */
    setRecord(path, ast) {
        this.count.clear(); // 清空计数器
        const record = getRecord();

        record.fileSize = ast.end - ast.start;
        record.fileRows = ast.loc.end.line - ast.loc.start.line + 1;

        this.records[path] = record;
    }

    /**
     * 统计注释信息
     * @param {string} path - 当前文件的标识，默认是文件的路径
     * @param {ASTNode} node 注释节点
     */
    statistics(path, node) {
        const record = this.getRecord(path);

        record.commentSize += node.end - node.start;
        record.commentRows += node.loc.end.line - node.loc.start.line + 1;
    }

    /**
     * 当前代码行数统计
     * @param {string} path 当前文件的标识
     * @param {object} param 附加信息，字段与`record`一致
     */
    summary(path, { codeRows, blankRows }) {
        const record = this.getRecord(path);

        record.codeSize = record.fileSize - record.commentSize;
        record.codeRows = codeRows > -1 ?
            codeRows : record.fileRows - record.commentRows;
        record.blankRows = blankRows > -1 ?
            blankRows : record.fileRows - record.codeRows - record.commentRows;

        record.blankRatio = record.blankRows / record.fileRows;
        record.rowsRatio = record.commentRows / record.fileRows;
        record.sizeRatio = record.commentSize / record.fileSize;

        record.evaluation = evaluate([
            record.rowsRatio,
            record.sizeRatio,
            record.blankRatio
        ]);
    }

    /**
     * 合计 `records` 中所有 `path`对应的注释率
     */
    combined() {
        const paths = Object.keys(this.records);
        const stats = this.stats;

        for (const path of paths) {
            const record = this.records[path];

            stats.fileSize += record.fileSize;
            stats.fileRows += record.fileRows;
            stats.codeSize += record.codeSize;
            stats.codeRows += record.codeRows;
            stats.blankRows += record.blankRows;
            stats.commentSize += record.commentSize;
            stats.commentRows += record.commentRows;

            this.options.verbose && this.console(path);
        }

        stats.sizeRatio = stats.commentSize / stats.fileSize;
        stats.rowsRatio = stats.commentRows / stats.fileRows;
        stats.blankRatio = stats.blankRows / stats.fileRows;

        stats.evaluation = evaluate([
            stats.rowsRatio,
            stats.sizeRatio,
            stats.blankRatio
        ]);

        this.console(stats);
    }

    /**
     * 将当前的`record`输出到终端
     * @param {object|string} path - 覆盖率统计实例或其ID
     */
    console(path) {
        let record = path;
        let header = l10n.get('coverage.projHeader');

        if (typeof path === 'string') {
            header = l10n.get('coverage.fileHeader', color.green(path));
            record = this.getRecord(path);
        }

        if (!record) {
            return logger.warn(l10n.get('coverage.noneRecord'));
        }

        // 克隆一个出来，不修改原始的记录
        record = Object.assign({}, record);

        let output = header;
        const indent = ' '.repeat(5);

        const mainLv = record.evaluation;
        const rowsLv = evaluate(record.rowsRatio);
        const sizeLv = evaluate(record.sizeRatio);
        // record.fileSize = (record.fileSize / 1024).toFixed(2) + 'K';
        record.rowsRatio = color`${rowsLv.color}${percentage(record.rowsRatio)} (${l10n.get(`coverage.level.${rowsLv.level}`)})`;
        record.sizeRatio = color`${sizeLv.color}${percentage(record.sizeRatio)} (${l10n.get(`coverage.level.${sizeLv.level}`)})`;
        record.evaluation = color`${mainLv.color}${mainLv.level} (${l10n.get(`coverage.level.${mainLv.level}`)})`;

        // 获取当前字符列表中，长度最大的字符的宽度
        const feilds = this.feilds;
        const maxWidth = getArrayMax(Object.keys(feilds).map(key => {
            return getStringWidth(feilds[key]);
        }));

        for (const feild in record) {
            output += '\n' + color`${indent}${'green'}${padRight(feilds[feild], maxWidth)} ${'white'}- ${record[feild]}`;
        }

        logger.out('');
        logger.info(output);
    }

    /**
     * 将覆盖记录转为JSON 字符串
     */
    toString() {
        return JSON.stringify(this.records, null, 4);
    }

    /**
     * 将覆盖率几率转为文本文件F
     */
    toText() {

    }
}

/**
 * 统计汇总的语言包
 * @access private
 * @memberof Coverage
 * @static
 */
Coverage.l10n = {
    default: {
        projHeader: "[Project] Comments coverage information of this project's javascript-code:",
        fileHeader: "[File] Comments coverage information of $1 :",
        noneRecord: "No corresponding statistical record exists",
        idNotFound: "The path: $1 indicates comments statistics do not exist.",
        level: {
            SS: "Perfect!",
            S: "Beautiful!",
            A: "Very good!",
            B: "Good!",
            C: "Ok!",
            D: "Just so so.",
            E: "You need to check your code and add some comments.",
            F: "Please comment your code.",
        },
        feilds: {
            fileSize: 'Filesize (Byte)',
            fileRows: 'Rows total',

            codeSize: 'Code size (Byte)',
            codeRows: 'Total of code rows',

            blankRows: 'Total of blank lines',
            commentSize: 'Comments size (Byte)',
            commentRows: 'Total of comment rows',

            blankRatio: 'Ratio of blank lines',
            rowsRatio: 'Ratio of Comments\'s rows',
            sizeRatio: 'Ratio of Comments\'s size',

            evaluation: 'Evaluation level'
        }
    },

    zh_CN: {
        projHeader: "(项目) JS代码的注释覆盖信息:",
        fileHeader: "(文件) $1 的注释覆盖信息:",
        noneRecord: "不存在相应的统计记录",
        idNotFound: "当前 path: $1 指代的注释统计信息不存在",
        level: {
            SS: "完美!",
            S: "漂亮!",
            A: "非常好!",
            B: "好!",
            C: "还行吧!",
            D: "一般般 ...",
            E: "你要检查下你的代码了，顺手再加点注解.",
            F: "请为你的代码添加注释!",
        },
        feilds: {
            fileSize: '文件体积 (Byte)',
            fileRows: '总行数',

            codeSize: '代码体积 (Byte)',
            codeRows: '代码总行数',

            blankRows: '空白行总数',
            commentSize: '注释体积 (Byte)',
            commentRows: '注释总行数',

            blankRatio: '空白行比率',
            rowsRatio: '注释行比率',
            sizeRatio: '注释体积比率',

            evaluation: '评比等级'
        }
    }
};

/**
 * 打分等级
 * @access private
 * @memberof Coverage
 * @static
 */
Coverage.levels = [
    {
        score: 0.7,
        level: "SS",
        color: "magenta"
    },
    {
        score: 0.6,
        level: "S",
        color: "yellow"
    },
    {
        score: 0.5,
        level: "A",
        color: "green"
    },
    {
        score: 0.4,
        level: "B",
        color: "blue"
    },
    {
        score: 0.3,
        level: "C",
        color: "grey"
    },
    {
        score: 0.2,
        level: "D",
        color: "white"
    },
    {
        score: 0.1,
        level: "E",
        color: "red"
    },
    {
        score: 0,
        level: "F",
        color: "black"
    },
];

/**
 * 获取评分等级
 * @access private
 * @memberof Coverage
 * @param {array} ratio 比例组 
 * @returns {object} level
 */
function evaluate(ratio) {
    ratio = [].concat(ratio);
    const average = ratio.reduce((sum, score) => sum + score, 0) / ratio.length;
    const { levels } = Coverage;

    for (let level of levels) {
        if (average >= level.score) {
            return level;
        }
    }

    return levels[levels.length - 1];
}

/**
 * @access private
 * @memberof Coverage
 */
function getRecord() {
    return {
        fileSize: 0, // 文件总大小
        fileRows: 0, // 文件总行数

        codeSize: 0, // 代码总大小
        codeRows: 0, // 代码总行数

        blankRows: 0, // 空白行总数
        commentSize: 0, // 注释总大小
        commentRows: 0, // 注释总行数

        blankRatio: 0, // 空行占比
        rowsRatio: 0, // 注释行占比
        sizeRatio: 0, // 注释大小占比

        evaluation: 0,  // 综合得分
    }
}

module.exports = new Coverage;