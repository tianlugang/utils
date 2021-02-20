export namespace CookieSimple {
  /**
   * 获取一条cookie
   * @param {string} key 名称
   */
  export function get(key: string) {
    if (typeof key !== 'string') return '';
    const cookie = document.cookie;
    if (cookie.length > 0) {
      let start = cookie.indexOf(key + '=');
      if (start > -1) {
        start = start + key.length + 1;
        let end = cookie.indexOf(';', start);
        if (end < 0) {
          end = cookie.length;
        }
        return decodeURIComponent(cookie.substring(start, end));
      }
    }

    return '';
  }

  /**
   * 新增一条cookie
   * @param {string} key 名称
   * @param {string} value 值
   * @param {number} time 过期时间
   */
  export function set(key: string, value: string, expire: number = 1) {
    if (typeof key === 'number') return;
    if (typeof value === 'string') {
      let expires = '';
      let date = new Date();
      date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));
      expires = ';expires=' + date.toUTCString();
      document.cookie = [key, '=', encodeURIComponent(value), expires].join('');
    }
  }

  /**
   * 删除指定名称的cookie
   * @param {string} key 
   */
  export function remove(key: string) {
    if (has(key)) {
      set(key, '', -1);
    }
  }

  /**
   * 清空本地所有cookie
   */
  export function clear() {
    var regExp = /[^ =;]+(?=\=)/g;
    var keys = document.cookie.match(regExp);
    if (keys) {
      for (let key of keys) {
        remove(key);
      }
    }
  }

  /**
   * 是否含有
   * @param {string} key 
   */
  export function has(key: string) {
    return !!get(key)
  }
}
