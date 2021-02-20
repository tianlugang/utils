const pa = require('path');
const fs = require('fs-extra');
const gb = require('glob');

const hint = require('./src/utils/hint');
const l10n = require('../l10n/l10n');
const parser = require('./src/parser');
const coverage = require('./src/coverage');
const builder = require('./src/builder');

/**
 * doca start class
 */
class Doca {
    /**
     * @param {object}   options
     * @param {String}   options.pattern source code match rules, it's a `GlobPattern`
     * @param {Object}   options.glob glob's options
     * @param {Object}   options.coverage coverage's options
     * @param {PathLink} options.codeDir project's code dir
     * @param {PathLink} options.rootDir project's root dir
     * @param {PathLink} options.lang Localization language Settings, default: 'English'
     */
    constructor(options) {
        this.options = Object.assign({}, options);
        this._setOptions();

        hint.setOptions(this.options);
        l10n.setOptions(this.options, hint);
        coverage.setOptions(this.options);
        parser.setOptions(this.options);
    }

    start() {
        this._match().then(async matches => {
            if (!matches.length) {
                throw new Error('No match files.');
            }
            const sync = [];

            for (const path of matches) {
                sync.push(
                    this._eachMatches(path)
                );
            }

            this._handleParserEvent();
            await Promise.all(sync).catch(err => { throw err; }).catch(err => {
                throw err;
            });

            // 汇总注释覆盖信息，并给出综合考核
            coverage.combined();
        }).catch(err => {
            throw err;
        });
    }

    /**
     * check user's options
     */
    _setOptions() {
        this.pattern = this.options.pattern;
        this.codeDir = this.options.codeDir;
        this.rootDir = this.options.rootDir;

        if (fs.existsSync(this.codeDir)) {
            if (typeof this.pattern !== 'string' || !this.pattern.trim()) {
                this.pattern = '**';
            }
            if (!fs.existsSync(this.rootDir)) {
                hint.warning(
                    '[doca._getOptions: rootDir]',
                    'You did not set the project\'s root directory.',
                    module.parent.filename
                );
            }
        } else {
            hint.warning(
                '[doca._getOptions: codeDir]',
                'You did not set the project\'s code directory, Default: ./src',
                module.parent.filename
            );
            this.rootDir = process.cwd();
            this.codeDir = pa.join(this.rootDir, 'src');
            this.pattern = '**';
        }

        this.options.pattern = this.pattern;
        this.options.codeDir = this.codeDir;
        this.options.lang = this.options.lang === 'zh_CN' ? 'zh_CN' : 'default';
        this.options.glob = Object.assign({ cwd: this.codeDir }, this.options.glob);
        this.options.coverage = Object.assign({}, this.options.coverage);
    }

    /**
     * match source code
     * @throws {Error}
     * @returns {Promise<Array>}
     * @access private
     */
    _match() {
        return new Promise((resolve, reject) => {
            gb(this.pattern, this.options.glob, (err, matches) => {
                if (err) {
                    return reject(err);
                }
                return resolve(matches);
            });
        }).catch(err => {
            throw err;
        });
    }

    /**
     * traverse matches, it is matches.forEach's callback
     * @param {PathLink} path
     */
    async _eachMatches(path) {
        return new Promise((resolve, reject) => {
            const realpath = pa.join(this.codeDir, path);

            return fs.readFile(realpath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                parser.start(data, path);
                resolve(true);
            });
        }).catch(err => {
            throw err;
        });
    }

    /**
     * @desc parser事件处理
     */
    _handleParserEvent() {
        /**
         * @listens Parser.begin
         * @this this
         */
        const _begin = (path, ast) => {
            coverage.setRecord(path, ast);
        };

        /**
         * @listens Parser.traverse
         * @this this
         */
        const _traverse = (path, ast) => {
            coverage.count.add(ast.startLine);
            coverage.count.add(ast.endLine);
        };

        /**
         * @listens Parser.each
         * @param {string} path file path
         * @param {object} options
         * @param {object} options.comment
         * @param {object} options.ast
         * @param {array}  options.tags
         * @this this
         */
        const _each = (path, { comment, ast, tags } = options) => {
            coverage.statistics(path, comment);
            tags.forEach(({ name, value }) => {
                builder.make(name, value);
            })
        };

        /**
         * @listens Parser.parsing
         * @this this
         */
        const _parsing = (name, value) => {
            console.log(name);
        };

        /**
         * @listens Parser.end
         * @this this
         */
        const _end = (path, ast) => {
            coverage.summary(path, { codeRows: coverage.count.size });
        };

        // 事件依次触发
        parser.on('begin', _begin);
        parser.on('traverse', _traverse);
        parser.on('each', _each);
        parser.on('parsing', _parsing);
        parser.on('end', _end);
    }
}

module.exports = {
    Doca
};