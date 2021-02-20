// 替换全部?\
export const replaceAll = (str: string, s1: string, s2: string) => str.replace(new RegExp(s1, 'gm'), s2);