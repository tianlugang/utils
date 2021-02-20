// 禁止页面被别人使用iframe嵌套
export function forbidFrameNestOurPages() {
  if (window.location != window.parent.location) window.parent.location = window.location;
}
