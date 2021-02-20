const { TagError, Tag, tags } = require('./tags/base');
/**
 * 生成标签
 * @param {string} name 标签名称
 * @param {string} text 标签内容
 * @param {object} tree 虚拟标签树
 */
function makeTag(name, text, tree) {
    const opt = tags[name];
    const tag = new Tag(opt.name, opt.tag);

    // console.log(tag)
}

module.exports = {
    make: makeTag
};