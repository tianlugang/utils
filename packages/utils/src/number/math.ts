export namespace MathExt {
  /**
   * 数学阶乘
   * @param {number}} n 
   */
  export function factorial(n: number) {
    if (n < 0) {
      return -1;
    } else if (n === 0 || n === 1) {
      return 1;
    } else {
      for (let i = n - 1; i >= 1; i--) {
        n *= i;
      }
    }

    return n;
  }

  /**
   * 数学排列
   * 排列 A(n,m)=n×（n-1）.（n-m+1）=n!/（n-m）!(n为下标,m为上标,以下同) 
   * @param {number} m 上标
   * @param {number} n 下标
   */
  export function arrange(m: number, n: number) {
    return factorial(n) / factorial(n - m);
  }

  /**
   * 数学组合 
   * 计算公式：C(n,m)=P(n,m)/P(m,m) =n!/(m!(n-m)!)
   * @param {number} m 上标
   * @param {number} n 下标
   * @example 
   *    function sum(i) {
    *      return combine(i, 3) * combine(3 - i, 37) / combine(3, 40);
    *    }
    *    sum(1) + sum(2) + sum(3);
    */
  export function combine(m: number, n: number) {
    return factorial(n) / (factorial(m) * factorial(n - m));
  }
}