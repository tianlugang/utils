'use strict';

function getPathById(id) {
  id = (id || 0).toString();
  if (id.length < 9) {
    id = ('000000000' + id).slice(-9);
  }

  const len = id.length;
  const max = Math.ceil(len / 3);
  let i = 0;
  let result = '';

  while (i < max) {
    result = '/' + id.slice(-3 * i - 3, len - 3 * i) + result;
    i++;
  }

  return result.substring(1);
}

module.exports = getPathById;

// export function getPathById(str = '', sep = '/') {
//     if (typeof str !== 'string' || Number(str) === 0) {
//         if (typeof str === 'number' && str !== 0) {
//             str = str.toString();
//         } else {
//             return `000${sep}000${sep}000`;
//         }
//     }

//     let rs,
//         row, col, i, j,
//         len = str.length;

//     for (i = 9 - len; i > 0; i--) {
//         str = '0' + str;
//     }
//     len = str.length;
//     row = Math.floor(len / 3);
//     col = len % 3;
//     rs = str.substring(0, col);
//     for (i = 0, j = col; i < row; i++, j = 3 * i + col) {
//         rs += (i === 0 && col === 0 ? '' : sep) + str.substring(j, j + 3);
//     }

//     return rs;
// }

// //原api的实现方式
// export function _getPathById(id) {
//     id = (id || 0).toString();
//     if (id.length < 9) {
//         id = ('000000000' + id).slice(-9);
//     }
//     let result = '';
//     const len = id.length;
//     const max = Math.ceil(len / 3);
//     let i = 0;

//     while (i < max) {
//         result = '/' + id.slice(-3 * i - 3, len - 3 * i) + result;
//         i++;
//     }

//     return result.substring(1);
// }
