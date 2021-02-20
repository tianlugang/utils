// 打开一个窗体通用方法
export function open(url: string, w: number = screen.width, h: number = screen.height, scrollbars: string = 'no', name: string = '') {
  var x = (screen.width - w) / 2.0;
  var y = (screen.height - h) / 2.0;
  var p, win
  if (navigator.appName == 'Microsoft Internet Explorer') {
    p = `resizable=1,location=no,scrollbars=no,width=${w},height=${h},left=${x}),top=${y}`;
    win = window.open(url, name, p);
  } else {
    p = `ZyiisPopup,top=${y},left=${x},scrollbars=${scrollbars},dialog=yes,modal=yes,width=${w},height=${h},resizable=no`;
    win = window.open(url, p);
    eval("try { win.resizeTo(w, h); } catch(e) { }");
    if (win) {
      win.focus();
    }
  }

  return win;
}
