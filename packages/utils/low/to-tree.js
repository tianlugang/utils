/* eslint no-console: 0 */
const noop = require('./noop');
const isNotString = require('./is-not-string');

/**
 * @name to-tree
 * @version
 * @description json to tree
 * @param {array} [data] - json data
 * @param {object} [options]
 *        {string} [options.self] 节点自身标识字段名
 *        {string} [options.parent] 父节点标识字段名
 *        {string} [options.children] 子节点集合的字段名
 *        {function} [options.callback] 每次入栈子节点时的回调
 * @returns {array} a tree
 * @example
 * const tree = toTree([{}, {}], {self: 'id', parent: 'pid', children: 'nodes', callback = ()=>{}})
 */
function toTree(data, {
  self,
  parent,
  children,
  callback
}) {
  if (!Array.isArray(data)) {
    throw new Error('The Data Must be an array');
  }

  if (isNotString(self) || isNotString(parent)) {
    throw new Error('The field name of the node id must be a string');
  }

  children = !isNotString(children) ? 'children' : children;
  callback = typeof callback === 'function' ? callback : noop;

  // 将数据存储为 以 self 为 KEY 的 map 索引数据列
  const arr = [],
    obj = {};

  for (let i = 0; i < data.length; i++) {
    // 以当前遍历项的 parent, 去 obj 对象中找到索引的 父节点
    const
      item = data[i],
      id = item[self],
      pid = item[parent],
      actualNode = {},
      parentNode = obj[pid],
      callbacked = callback(item, actualNode);

    if (parentNode) {
      // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到他对应的父级中
      (parentNode[children] || (parentNode[children] = [])).push(actualNode);
    } else {
      //如果没有在obj中找到对应的索引pid , 那么直接把当前的节点添加到结果集中，作为顶级
      arr.push(actualNode);
      obj[id] = actualNode;
    }

    obj[id] = actualNode;

    if (callbacked === false) {
      break;
    } else if (callbacked === true) {
      continue;
    }
  }

  return arr;
}

module.exports = toTree;
