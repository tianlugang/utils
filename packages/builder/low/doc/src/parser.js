const EventEmitter = require("events").EventEmitter;
const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const { logger } = require('./utils');
const Segment = require('./middleware/segment');

const defaultBabylon = {
  sourceType: "module",
  plugins: [],
  tokens: true
};

/**
 * @desc 注释解析引擎
 * @member {object} options
 * @event begin - 解析开始
 * @event traverse - ast遍历
 * @event each - 注释遍历
 * @event end - 解析结束
 */
class Parser extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0);
    this.segment = new Segment(); // 分段器
  }

  /**
   * @param {object} options - 配置项
   * @param {object} options.parser  - 解析器配置项
   * @param {object} options.babylon - 传递给js语法解析引擎 `babylon`的配置
   * @param {object} options.segment - 注释分段器的配置
   */
  setOptions({ parser, segment, babylon }) {
    this.options = Object.assign({}, parser);
    this.options.babylon = Object.assign({}, defaultBabylon, babylon);
    this.options.segment = Object.assign({}, segment);
    this.segment.setOptions(this.options.segment);
  }

  /**
   * @param {string} code - `javascript` code
   * @param {string} path - 被统计的标识
   * @emits begin(<lib:object>) - 解析开始
   * @emits traverse(ast:object) 语法树遍历
   * @emits each(<lib:object,node:ASTNode,tags:object>) - 注释被解析指示
   * @emits end(<lib:object>) - 解析结束
   */
  start(code, path) {
    if (code.charAt(0) === "#") {
      code = code.replace(/^#!/, "//");
    }
    const self = this;
    const ast = babylon.parse(code, this.options.babylon);

    this.emit('begin', path, ast);

    traverse(ast, {
      noScope: true,
      Program(pa, st) {

        pa.traverse({
          enter(_pa) {
            const { node, parent } = _pa;
            const _ast = self._makeAst(node, parent);

            for (const comment of _ast.comments) {

              self._isESDoc(comment) && self.emit('each', path, {
                comment,
                ast: _ast,
                tags: self._parse(comment)
              });
            }

            self.emit('traverse', path, _ast);
          }
        });
      }
    });

    this.emit('end', path, ast);
  }

  // is es doc comments
  _isESDoc(node) {
    if (node.type !== 'CommentBlock') return false;
    return node.value.charAt(0) === '*';
  }

  /**
   * 解析文档注释
   * @param {ASTNode} node - 注释节点
   * @param {string} node.value - 节点的内容
   * @param {string} node.type - 节点的类型
   * @emits parsing<name,value> - 注释解析过程
   * @returns {array<object{name: string, value: string}>} 解析成内置的标签组
   */
  _parse({ value }) {
    const tags = [];
    const lines = this.segment.spilt(value);

    for (let i = 0, name = "", value = ""; i < lines.length; i++) {
      const line = lines[i];
      if (line.charAt(0) === "@") {
        name = line;
        const nextLine = lines[i + 1];

        if (nextLine.charAt(0) === "@") {
          value = "";
        } else {
          value = nextLine;
          i++;
        }

        value = this.segment.format(value);
        this.emit('parsing', name, value);
        tags.push({ name, value });
      }
    }

    return tags;
  }

  // 获取注释与节点的映射
  _makeAst(node, parent) {
    const loc = node.loc;
    return {
      type: node.type,
      start: node.start,
      end: node.end,
      startLine: loc.start.line,
      endLine: loc.end.line,
      startColumn: loc.start.column,
      endColumn: loc.end.column,
      name: loc.identifierName,
      comments: node.leadingComments || [],
      parent: parent // ? this._makeAst(parent, null) : null
    }
  }
}

module.exports = new Parser();
