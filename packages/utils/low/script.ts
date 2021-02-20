// 返回脚本内容
export namespace Script {
  export const getContent = (s: string, callback: () => void) => {
    if (s.indexOf("<script") == -1 || typeof callback !== 'function') return s;
    var p = /<script[^\>]*?>([^\x00]*?)<\/script>/gi;
    var arr = [];

    while ((arr = p.exec(s))) {
      var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/i;
      var arr1 = [];
      arr1 = p1.exec(arr[0]);
      if (arr1) {
        callback(arr1[1], "", arr1[2], arr1[3]);
      } else {
        p1 = /<script(.*?)>([^\x00]+?)<\/script>/i;
        arr1 = p1.exec(arr[0]);
        callback('', arr1[2], arr1[1].indexOf('reload=') != -1);
      }
    }

    return s;
  }

  // 清除脚本内容
  export const strip = (s: string) => s.replace(/<script.*?>.*?<\/script>/gi, '');
}
