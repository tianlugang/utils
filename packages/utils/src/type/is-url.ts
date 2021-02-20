'use strict';
/**
 * 校验是否为网址
 * 网页地址中允许出现 /%*?@& 等其他允许的符号
 * 可以没有www开头(或其他二级域名) ，仅域名
 * 以https://、http://、ftp://、rtsp://、mms://开头、或者没有这些开头
 *
 * @name is.url
 * @version 1.0.0
 * @keyword url is.url is-valid-url
 * @description Determines whether the incoming value is a URL
 * @dependencies
 * @example
 *    const isUrl = require('@writ/utils/is-url');
 *
 *    isUrl('http://google.com');  // true
 *    isUrl('https://google.com'); // true
 *    isUrl('ftp://google.com');   // true
 *
 *    isUrl('http://');            // false
 *    isUrl('http://google');      // false
 *    isUrl('http://google.');     // false
 *    isUrl('google');             // false
 *    isUrl('google.com');         // false
 *    isUrl(1111);                 // false
 */
export namespace isURL {
  export const v1 = (str: string) => /^(https:\/\/|http:\/\/|ftp:\/\/|rtsp:\/\/|mms:\/\/)?[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(str)
  export const v2 = (str: string) => /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i.test(str)
  export const v3 = (str: string) => /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str)
}
