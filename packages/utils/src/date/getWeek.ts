/**
 * 获得当前日期的中国星期序号（周一至周日分别为1-7而不是1-6和0）
 * 加6模7，即可将周日调到周六的后面，此时周一至周日为0-6
 * 直接取昨天的星期序号+1也可得到该结果，但比这个更麻烦
 * 如果需要返回中文的星期名称用：return "星期"+"天一二三四五六".charAt(new Date().getDay())
 */
export function getWeek(lang: string) {
  const index = new Date().getDay();

  switch (lang) {
    case 'en':
      return ['Sundays', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index];
    case 'zh-cn':
      return '星期' + '天一二三四五六'.charAt(index);
    default:
      return (index + 6) % 7 + 1;
  }
}
