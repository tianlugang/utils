// 格式化CSS样式代码
export const cssFormat = (s: string) => {
  //格式化代码
  s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
  s = s.replace(/;\s*;/g, ";"); //清除连续分号
  s = s.replace(/\,[\s\.\#\d]*{/g, "{");
  s = s.replace(/([^\s])\{([^\s])/g, "$1 {\n\t$2");
  s = s.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n$2");
  s = s.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
  return s;
}