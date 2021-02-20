// 标签解析器
const Extractors = {
    link: /^`([\s\S]+)`\s*\{@link\s+([\s\S]+)\}$/,
    text: /^`([\s\S]+)`\s*\{@text\s+([\s\S]+)\}$/,
    source: /^`([\s\S]+)`\s*\{@source\s+([\s\S]+)\}\(([\s\S]+)\)$/,
};
// const lineBreak = /\r\n?|[\n\u2028\u2029]/;
// const lineBreakG = new RegExp(lineBreak.source, "g");

module.exports = Extractors;