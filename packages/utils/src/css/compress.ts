// 压缩CSS样式代码
export const cssCompress = (s: string) => {
  //压缩代码
  s = s.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
  s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
  s = s.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
  s = s.replace(/;\s*;/g, ";"); //清除连续分号
  let match = s.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
  return match == null ? "" : s[1];
}