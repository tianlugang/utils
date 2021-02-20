/**
 * 校验是否为IPv6地址
 * 支持IPv6正常格式
 * 支持IPv6压缩格式
 * @param {string} str 
 */
export const isIPv6 = (str: string) => {
  let match = str.match(/:/g)

  return match
    ? match.length <= 7
    : false && /::/.test(str)
      ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)
      : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str)
}