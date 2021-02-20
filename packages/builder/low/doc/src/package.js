/**
 * 包模型
 * @property {string} name  包名称
 * @property {string} desc  包描述与简介
 * @property {string} version 包版本号
 * @property {array}  keyword 包关键词
 * @property {object} dependencies 包依赖
 */
class Model {
  constructor() {
    this.name;
    this.desc;
    this.version;
    this.keyword;
    this.dependencies;
  }
}

module.exports = Model;
