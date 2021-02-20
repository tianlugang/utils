const startRegex = /^(\.|-|_|\+|\||\\|\/|\s|=)+/;

/**
 * @name string.hump
 * @description 驼峰化字符串
 * @version 1.0.0
 * @keyword humpify hump hump-string
 * @dependencies
 * @example
 *    hump('-all-boys');  //  allBoys
 *    hump('-all\boys');  //  allBoys
 *    hump('-all|boys');  //  allBoys
 *    hump('-all boys');  //  allBoys
 *    hump('-all=boys');  //  allBoys
 *    hump('-all+boys');  //  allBoys
 *    hump('-all_boys');  //  allBoys
 *    hump('-all.boys');  //  allBoys
 * @param {string} str
 * @returns {string} a humped string of origin `str`
 */
export const humpify = (str: string) => {
    str = str.replace(startRegex, '');
    return str.trim().replace(/(\.|-|_|\+|\||\\|\/|\s|=)+\w/g, m => m.slice(-1).toUpperCase());
}