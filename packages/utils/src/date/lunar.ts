'use strict';
type IStringOrNumber = string | number

const getBit = (m: number, n: number) => (m >> n) & 1
const locale = {
  numeric: '一二三四五六七八九十', // 
  heavenlyStems: '甲乙丙丁戊己庚辛壬癸', // 天干
  earthlyBranches: '子丑寅卯辰巳午未申酉戌亥', // 地址
  monthes: '正二三四五六七八九十冬腊' // 月份
}


// 获取农历
export class LunarDate extends Date {
  readonly startYear = 1921
  readonly currentYear = new Date().getFullYear()
  private madd = new Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334)
  private calendar = new Array(
    0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F,
    0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E,
    0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B,
    0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5,
    0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA,
    0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55,
    0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5,
    0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B,
    0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B,
    0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96,
    0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D,
    0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5,
    0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95
  )
  year!: number
  month!: number
  day!: number

  constructor() {
    super()
    this.parse()
  }

  parse() {
    var total, m, n, k;
    var isEnd = false;
    var tmp = this.getFullYear();

    total = (tmp - this.startYear) * 365 + Math.floor((tmp - this.startYear) / 4) + this.madd[this.getMonth()] + this.getDate() - 38;
    if ((this as any).getYear() % 4 == 0 && this.getMonth() > 1) {
      total++;
    }

    for (m = 0; ; m++) {
      k = (this.calendar[m] < 0xfff) ? 11 : 12;

      for (n = k; n >= 0; n--) {
        if (total <= 29 + getBit(this.calendar[m], n)) {
          isEnd = true;
          break;
        }

        total = total - 29 - getBit(this.calendar[m], n);
      }

      if (isEnd)
        break;
    }

    this.year = this.startYear + m;
    this.month = k - n + 1;
    this.day = total;

    if (k == 12) {
      if (this.month == Math.floor(this.calendar[m] / 0x10000) + 1) {
        this.month = 1 - this.month;
      }
      if (this.month > Math.floor(this.calendar[m] / 0x10000) + 1) {
        this.month--;
      }
    }
  }

  toLunarDateString() {
    var tmp = "";
    tmp += locale.heavenlyStems.charAt((this.year - 4) % 10);
    tmp += locale.earthlyBranches.charAt((this.year - 4) % 12);
    tmp += "年 ";
    if (this.month < 1) {
      tmp += "(闰)";
      tmp += locale.monthes.charAt(-this.month - 1);
    } else {
      tmp += locale.monthes.charAt(this.month - 1);
    }
    tmp += "月";
    tmp += (this.day < 11) ? "初" : ((this.day < 20) ? "十" : ((this.day < 30) ? "廿" : "三十"));
    if (this.day % 10 != 0 || this.day == 10) {
      tmp += locale.numeric.charAt((this.day - 1) % 10);  // 汉语数字
    } // 月份

    return tmp;
  }

  toLunarDate(year: IStringOrNumber, month: IStringOrNumber, day: IStringOrNumber) {
    if (year < this.startYear || year > this.currentYear) {
      return "";
    } else {
      const intMonth = parseInt(month.toString())
      const intYear = parseInt(year.toString())
      const intDay = parseInt(day.toString())

      month = intMonth > 0 ? (intMonth - 1) : 11;
      this.setFullYear(intYear, month, intDay);
      this.parse();

      return this.toLunarDateString();
    }
  }
}