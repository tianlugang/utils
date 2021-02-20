function getStep(size: number) {
  let s = size;
  const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB', 'CB'];

  for (let i = 0; i < u.length; i++) {
    const spec = Math.pow(1024, i);
    if (size < 100 * spec) {
      s = (size / spec);
      break;
    }
  }
  const ten = s / 5;

  return s > 15 ? s / 100 / ten : s / 100 / 1;
}

export const speedmeter = (size: number, calcStep: boolean = true) => {
  let k = calcStep ? getStep(size) : size;
  let i = k / 21;
  const end = 0.98;

  return function (s: number) {
    var start = s;

    if (start >= end) {
      return end;
    }

    start += k;
    k -= i;

    if (k < 0.001) {
      k = 0.001;
    }

    return start;
  };
}
