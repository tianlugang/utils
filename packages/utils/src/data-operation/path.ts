export const pathUtil = {
  // path normalize
  absulote(path: string) {
    return path.startsWith('/') ? path : `/${path}`
  },

  partition(id: string | number) {
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
}

export default pathUtil