/**
 * 测试元素光标向前移动一位
 *  var nowIndex = getPosition(element);
 *  setCaretPosition(element, nowIndex - 1);
 *  console.log(getPosition(element));
 */
export default {
  /**
   * 获取当前光标位置
   * @param ctrl
   * @returns {number}
   */
  getPosition(element) {
    let caretPos = 0;
    console.log(0)
    if (document.selection) { //支持IE
      console.log(1)
      element.focus();
      const Sel = document.selection.createRange();
      Sel.moveStart('character', -element.value.length);
      caretPos = Sel.text.length;
    } else if (element.selectionStart || element.selectionStart == '0') {
      console.log(2)
      //支持firefox
      caretPos = element.selectionStart;
    }
    return caretPos;
  },

  /**
   * 设置光标位置
   * @param ctrl
   * @param pos
   */
  setPosition(element, pos) {
    if (element.setSelectionRange) {
      element.focus();
      element.setSelectionRange(pos, pos);
    } else if (element.createTextRange) {
      const range = element.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  },

  insertContent(content) {
    if (!content) { //如果插入的内容为空则返回
      return;
    }
    let sel = null;
    if (document.selection) { //IE9以下
      sel = document.selection;
      sel.createRange().pasteHTML(content);
    } else {
      sel = window.getSelection();
      if (sel.rangeCount > 0) {
        let range = sel.getRangeAt(0); //获取选择范围
        range.deleteContents(); //删除选中的内容
        let el = document.createElement("div"); //创建一个空的div外壳
        el.innerHTML = content; //设置div内容为我们想要插入的内容。
        let frag = document.createDocumentFragment(); //创建一个空白的文档片段，便于之后插入dom树

        let node = el.firstChild;
        let lastNode = frag.appendChild(node);
        range.insertNode(frag); //设置选择范围的内容为插入的内容
        let contentRange = range.cloneRange(); //克隆选区
        contentRange.setStartAfter(lastNode); //设置光标位置为插入内容的末尾
        contentRange.collapse(true); //移动光标位置到末尾
        sel.removeAllRanges(); //移出所有选区
        sel.addRange(contentRange); //添加修改后的选区
      }
    }
  }
}

'use strict';
//获取当前光标位置
function getPosition(element) {
  let caretOffset = 0;
  let doc = element.ownerDocument || element.document;
  let win = doc.defaultView || doc.parentWindow;
  let sel;
  if (typeof win.getSelection != "undefined") { //谷歌、火狐
    sel = win.getSelection();
    if (sel.rangeCount > 0) { // 选中的区域
      const range = win.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange(); //克隆一个选中区域
      preCaretRange.selectNodeContents(element); //设置选中区域的节点内容为当前节点
      preCaretRange.setEnd(range.endContainer, range.endOffset); //重置选中区域的结束位置
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    //IE
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

//设置光标位置
function setPosition(element, pos) {
  let range, selection;
  if (document.createRange) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange(); //创建一个选中区域
    range.selectNodeContents(element); //选中节点的内容
    if (element.innerHTML.length > 0) {
      range.setStart(element.childNodes[0], pos); //设置光标起始为指定位置
    }
    range.collapse(true); //设置选中区域为一个点
    selection = window.getSelection(); //获取当前选中区域
    selection.removeAllRanges(); //移出所有的选中范围
    selection.addRange(range); //添加新建的范围
  } else if (document.selection) {
    //IE 8 and lower
    range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
    range.moveToElementText(element); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    range.select(); //Select the range (make it the visible selection
  }
}

'use strict';
// 获取用户选择内容
function saveSelection() {
  if (window.getSelection) {
    /*主流的浏览器，包括chrome、Mozilla、Safari*/
    var sel = window.getSelection();
    if (sel.rangeCount > 0) {
      return sel.getRangeAt(0);
    }
  } else if (document.selection) {
    /*IE下的处理*/
    return document.selection.createRange();
  }
  return null;
}

// 恢复光标位置
function restoreSelection() {
  var selection = window.getSelection();
  if (selectedRange) {
    try {
      selection.removeAllRanges(); /*清空所有Range对象*/
    } catch (ex) {
      /*IE*/
      document.body.createTextRange().select();
      document.selection.empty();
    };
    /*恢复保存的范围*/
    selection.addRange(selectedRange);
  }
}
// 将光标移至文本最后
function selectAllText(elem) {
  if (window.getSelection) {
    elem.focus();
    var range = window.getSelection();
    range.selectAllChildren(elem);
    range.collapseToEnd();
  } else if (document.selection) {
    var range = document.selection.createTextRange();
    range.moveToElementText(elem);
    range.collapse(false);
    range.select(); /*避免产生空格*/
  }
}
// 将光标置于表单元素的最后
function toTextEnd(elem) {
  if (window.getSelection) {
    elem.setSelectionRange(elem.value.length, elem.value, length);
    elem.focus()
  } else if (document.selection) {
    /*IE下*/
    var range = elem.createTextRange();
    range.moveStart('character', elem.value.length);
    range.collapse(true);
    range.select();
  }
}
// 选中所有文字
function selectAllText(elem) {
  if (window.getSelection) {
    elem.setSelectionRange(0, elem.value.length);
    elem.focus();
  } else if (document.selection) {
    var range = elem.createTextRange();
    range.select();
  }
}
// 获取光标位置
function getCursorPosition(elem) {
  if (window.getSelection) {
    return elem.selectionStart;
  } else if (document.selection) {
    elem.focus();
    var range = document.selection.createTextRange();
    range.moveStart('character', -elem.value.length);
    return range.text.length;
  }
  return elem.value.length;
  // 设置光标位置
  function setCursorPosition(elem, position) {
    if (window.getSelection) {
      elem.focus();
      elem.setSelectionRange(position, position);
    } else if (document.selection) {
      var range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', position);
      range.moveStart('character', position);
      range.select();
    }
  }
