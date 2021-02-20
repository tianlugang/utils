/**
 * 全角转换为半角函数
 * @param {string} str 
 */
export const full2Half = (str: string) => {
    // if (str == null) return '';
    // str = str.toString();

    let result = "";

    for (let i = 0, code; i < str.length; i++) {
        code = str.charCodeAt(i);
        if (code >= 65281 && code <= 65374) {
            result += String.fromCharCode(str.charCodeAt(i) - 65248);
        } else if (code == 12288) {
            result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}