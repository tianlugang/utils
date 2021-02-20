export function percentage(num: number, fixed?: number) {
  num = num * 100;

  return (fixed ? num.toFixed(fixed) : num) + '%';
}
