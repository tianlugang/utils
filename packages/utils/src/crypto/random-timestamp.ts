var a = () => ((1000 * Math.random()).toString())
var b = parseInt;

// 随机数时间戳
export function genRandomTimestamp() {
  return new Date().getTime() + b(a()) + b(a()) + b(a());
}
