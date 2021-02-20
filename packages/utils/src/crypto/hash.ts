/**
 * 生成指定长度的 hash 值
 * @param {number} length 
 */
export namespace Hash {
  export function v1(length: number) {
    if (!length || typeof length !== 'number') {
      return;
    }

    let ar = '1234567890abcdefghijklmnopqrstuvwxyz';
    let hs = [];
    let hl = Number(length);
    let al = ar.length;

    for (let i = 0; i < hl; i++) {
      hs.push(ar[Math.floor(Math.random() * al)]);
    }

    return hs.join('');
  }
}