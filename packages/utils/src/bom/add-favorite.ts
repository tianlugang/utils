/**
 * 加入收藏夹
 * @param {String} origin 网址
 * @param {String} title 标题
 */
export function addFavorite(origin: string = location.origin, title: string) {
  try {
    (window.external as any).addFavorite(origin, title);
  } catch (e) {
    try {
      (window as any).sidebar.addPanel(title, origin, "");
    } catch (e) {
      alert("加入收藏失败，请使用Ctrl+D进行添加");
    }
  }
}
