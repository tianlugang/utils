const babylon = require('babylon');
const DEFAULT = { sourceType: 'module', plugins: [] };

/**
 * ECMAScript Parser.
 * parse ECMAScript source code.
 * @param {string} code - source code.
 * @param {object} option - parse option
 * @returns {AST} AST of source code.
 * @example
 * const parse = require('./ast.js');
 * let ast = parse('const foo = "hello world."');
 */
function parse(code, option) {
  if (code.charAt(0) === '#') {
    code = code.replace(/^#!/, '//');
  }

  option = Object.assign({}, DEFAULT, option);
  return babylon.parse(code, option);
}
module.exports = parse;
