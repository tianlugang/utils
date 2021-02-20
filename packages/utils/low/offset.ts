function getEventCoord(e) {
  // 计算光标到文档的距离
  return {
    left: window.pageXOffset + e.clientX,
    top: window.pageYOffset + e.clientY
  };
}

// 解决offsetX兼容性问题
// 针对火狐不支持offsetX/Y
function getOffset(e) {
  var target = e.target, // 当前触发的目标对象
    eventCoord,
    pageCoord,
    offsetCoord;

  // 计算当前触发元素到文档的距离
  pageCoord = getPageCoord(target);

  // 计算光标到文档的距离
  eventCoord = {
    top: window.pageXOffset + e.clientX,
    left: window.pageYOffset + e.clientY
  };

  // 相减获取光标到第一个定位的父元素的坐标
  offsetCoord = {
    top: eventCoord.top - pageCoord.top,
    left: eventCoord.left - pageCoord.left
  };

  return offsetCoord;
}


function getPageCoord(el: HTMLElement) {
  var coord = {
    top: 0,
    left: 0
  };
  var node = el
  // 计算从当前触发元素到根节点为止，
  // 各级 offsetParent 元素的 offsetLeft 或 offsetTop 值之和
  while (node) {
    coord.top += node.offsetTop;
    coord.left += node.offsetLeft;
    if (node.offsetParent) {
    }
  }

  return coord;
}

export default getOffset;
