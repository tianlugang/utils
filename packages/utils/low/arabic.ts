// export namespace Arabic {
//     export const locale = {
//         areas: '零一二三四五六七八九',
//         units: [
//             // 中文数字与阿拉伯数字的隐射表
//             { unit: '十', limit: 1e1 },
//             { unit: '百', limit: 1e2 },
//             { unit: '千', limit: 1e3 },
//             { unit: '万', limit: 1e4 },
//             { unit: '亿', limit: 1e8 },
//             { unit: '万亿', limit: 1e12 },
//             { unit: '亿亿', limit: 1e16 },
//         ]
//     }

//     /**
//      * [numberToUnitStr 数字转换单位字符串]
//      * @param  {string} number [description]
//      * @return {string}        [description]
//      */
//     export const toUnit = (num: string) => {
//         const n = parseInt(num, 10)
//         const { units } = locale
//         let offset = 0

//         // 数值显示规则（四舍五入）
//         for (const { unit, limit } of units) {
//             if (n < limit && n >= offset) {
//                 return n + unit;
//             }
//         }

//         return n;
//     }

//     // 将阿拉伯数字转为汉语数字
//     export function toChinese(num: number) {
//         const str = parseInt(num.toString(10)).toString(10)
//         const cnn = '〇一二三四五六七八九十百千万亿零壹贰叁肆伍陆柒捌玖拾佰仟萬億';

//         if (num < 10) {
//             return cnn[num]
//         }

//         let i = str.length - 1

//         // 一二三四 => 一千二百三十四
//         // 一二三四五六七八九 => x亿x千x百x十x万x千x百x十x
//         do {
//             const c = str[i]
//             const n = parseInt(c)
//             const m = Math.pow(10, n)

//             const sec = ~~(num / m)
//             const mod = num % m

//             i--;
//         } while (i >= 0);
//     }

//     /**
//      * 将汉语数字转为阿拉伯数字
//      */
//     export function toArabicNum(cnn: string) {
//         let rtn = [];
//         let arab = 0;
//         const str = cnn.split('');
//         const max = str.length - 1;
//         const areas = '〇一二三四五六七八九 零壹贰叁肆伍陆柒捌玖';
//         const units = '十百千万亿 拾佰仟萬億';
//         const limit = {
//             十: 1e1,
//             百: 1e2,
//             千: 1e3,
//             万: 1e4,
//             亿: 1e8,
//         }

//         for (let i = 0, n, v; i <= max; i++) {
//             v = str[i];
//             n = areas.indexOf(v);

//             if (n > -1) {
//                 arab = n;
//                 if (i === max) {
//                     rtn.push(arab);
//                 }
//             } else {
//                 let index = units.indexOf(v);
//                 if (index > -1) {
//                     // let y = (index === 3 ? index + 4 : index) + 1
//                     let unit = (limit as any)[v]

//                     rtn.push(unit * arab);
//                 }

//                 arab = 0;
//             }
//         }

//         return rtn;
//     }

//     /**
//      * 将中文数字转为阿拉伯数字
//      * leftOnly 和 rightLimit 分别为正则限定字符，防止“千山万水”被替换为“1000山10000水”
//      * @param  {[String]} str    [要替换的字符]
//      * @param  {[String]} leftOnly  [左侧限定字符]
//      * @param  {[String]} rightLimit [右侧限定字符]
//      * @return {[String]}        [返回替换后的字符]
//      * @example 
//      *    cnn2arab("第一千零叁十五章 千山万水","第","章")  // “第1035章 千山万水”
//      */
//     export const toArabic = (str: string, leftOnly: string = '', rightLimit: string = '') => {
//         const cnn = '〇一二三四五六七八九十百千万亿零壹贰叁肆伍陆柒捌玖拾佰仟萬億';
//         const arab = ['+0', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', '0', '00', '000', '0000', '00000000'];

//         return str.replace(new RegExp(leftOnly + '([' + cnn + ']+)' + rightLimit, 'g'), function (a, b) {
//             let tmpstr = '';

//             for (const i in b) {
//                 tmpstr += arab[cnn.indexOf(b[i]) % 15];
//             }

//             // 修复十三或一千零十三的错误
//             return leftOnly + eval(tmpstr.replace(/(^0|\+00)/g, '+10')) + rightLimit;
//         });
//     }
// }
