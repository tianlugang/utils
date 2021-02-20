// 缓存优化
// const fbi = (() => {
//     const memo = [0, 1]
//     return function getFB(n) {
//         let result = memo[n]
//         if (typeof result !== 'number') {
//             result = getFB(n - 1) + getFB(n - 2)
//             memo[n] = result
//         }
//         return result
//     }
// })();

// // 递归
// function getFB(n) {
//     if (n == 1 || n == 2) {
//         return 1;
//     } else {
//         return getFB(n - 1) + getFB(n - 2);
//     }
// }

// 动态规划
// 计算斐波拉契数列
export const fibonacci = (n: number) => {
  let [a, b] = [0, 1];
  while (n > 0) {
    [a, b] = [b, a + b];
    n--;
  }
  return a;
}