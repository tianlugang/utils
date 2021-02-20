//是否是闰年
export const isLeapYear = (y: number) => y % 4 == 0 && y % 100 != 0 || y % 400 == 0
