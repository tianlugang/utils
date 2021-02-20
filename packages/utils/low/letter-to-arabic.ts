// 字母和数据库中字母对应的id之间的转换，如果传入A则返回1，传入4则返回D
export function letter2arabic(letterOrId: string) {
  const letters = '_ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 前面多个_号是因为数据库中用1表示字母A

  if (isNaN(letterOrId)) {
    return letters.indexOf(letterOrId.toUpperCase()); // 也可以用letterOrId.toUpperCase().charCodeAt()-64
  }

  return letters.charAt(letterOrId); // 也可以用String.fromCharCode(64+letterOrId)
}
