/**
  * 任意对象转整型
  * @param  {Object} n 任意对象
  * @return {Number}     返回整数
  */
export const toInt = (n: string) => {
    var num = parseInt(n, 10);

    return isNaN(num) ? 0 : num;
}