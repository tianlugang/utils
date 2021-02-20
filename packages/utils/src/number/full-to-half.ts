/**
   * 全角符号转半角符号
   * 将字符串中的全角数字替换为半角数字
   * 因为MSSQL查询中全角数字会等同于半角数字
   * 测试 select getdate() where '５'='5' 为真
   */
export const full2half = (str: string) => {
    return str.replace(/[\uff10-\uff19]/ig, function ($0) {
        return '０１２３４５６７８９'.indexOf($0).toString();
    });
}