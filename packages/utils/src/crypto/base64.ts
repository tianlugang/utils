export namespace Base64 {
  export function encode(s: string) {
    return window.btoa(encodeURIComponent(s));
  }

  export function decode(s: string) {
    return decodeURIComponent(window.atob(s));
  }

  /**
   * 将字符串转换为 base64
   * @param str
   * @returns {string}
   */
  export function encrypt(str: string) {
    return btoa(encodeURIComponent(str)
      .replace(/%([0-9A-F]{2})/g, (_match, p1) => {
        return String.fromCharCode(Number('0x' + p1));
      })
    );
  }

  /**
   * 将base64转为中文
   * @param str
   * @returns {string}
   */
  export function decrypt(str: string) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
}
