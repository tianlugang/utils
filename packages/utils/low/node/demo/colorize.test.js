/* eslint no-console: 0 */
const colorize = require('../node-colorize');

test('Utils.colorize usage', function () {
  expect(colorize `hello ${'red'}w-${'green'}o-${'blue'}r-${'yellow'}l-${'grey'}d`);
  expect(colorize `hello ${'red'}wolrd ${'green'}${'white'} 1111!`);
});
