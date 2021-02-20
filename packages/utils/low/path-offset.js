/** 
 * 路径偏移
 * @param  {string} path 
 * @param  {number} offset 
 * @return {String} 返回偏移后的路径
 */
function offsetPath(path, offset) {
  return encodeURIComponent(path.toUpperCase()).replace(/./g, function (v) {
    return String.fromCharCode(v.charCodeAt(0) + offset % 10);
  }).replace(/([\\"'])/g, '\\$1');
}

module.exports = offsetPath;
