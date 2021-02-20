'use strict';

function partition(str = '', sep = '/', very = 3) {
  if ('string' !== typeof str || str * 1 === 0) {
    return '000' + sep + '000' + sep + '000';
  }
  var str, rs,
    row, col, i, j,
    len = str.length;
  for (i = 9 - len; i > 0; i--) {
    str = '0' + str;
  }
  len = str.length;
  row = Math.floor(len / very);
  col = len % very;
  rs = str.substring(0, col);
  for (i = 0, j = col; i < row; i++, j = very * i + col) {
    rs += (i === 0 && col === 0 ? '' : sep) + str.substring(j, j + very);
  }
  return rs;
}

module.exports = partition;
