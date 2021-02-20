/**
 * 半角转换为全角函数
 * @param {string} str 
 */
export const half2Full = (str: string) => {
    // if (str == null) return '';
    // str = str.toString();

    let result = "";

    for (let i = 0, code; i < str.length; i++) {
        code = str.charCodeAt(i);
        if (code >= 33 && code <= 126) {
            result += String.fromCharCode(str.charCodeAt(i) + 65248);
        } else if (code == 32) {
            result += String.fromCharCode(str.charCodeAt(i) + 12288 - 32);
        } else {
            result += str.charAt(i);
        }
    }

    return result;
}