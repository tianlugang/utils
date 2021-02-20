/* eslint no-undefined: 0*/
/* global describe,it, Symbol */

const { ToRegex, toRegex } = require('../src/to-regex');

const defaults = {
	cache: false, // --------------- 是否缓存
	strict: false,// --------------- 严格的开合规则 /^ ... $/
	terror: true, // --------------- 是否抛出错误
	strictStart: true, // --------- 严格的开头 /^ ... /
	strictEnd: true, // ------------ 严格的开结尾 / ... $/
	flags: '', // ----------------- 标志 g m i
	negate: false, // -------------- 排除型字符组 ， 与脱字符 “^” 一起使用
	strictNegate: false, // -------- 严格模式
	strictNegateEnd: '+' // -------- 排除型字符组的匹配次数
};
const flags = ['g', 'i', 'm', 'u', 'y'];
const maxLen = 2 << 15;

describe('toRegex 测试', function () {

	it('实例声明过程正常，返回ToRegex实例', function () {
		expect(new ToRegex()).is.an('object').and.instanceof(ToRegex);
	});

	it('获取属性getDefaults，得到了与预期值相等的结果', function () {
		expect(toRegex.getDefaults).is.an('object').and.that.is.deep.equal(defaults);
	});

	it('获取属性maxlen，它是一个Getter，并且不能被覆盖', function () {
		expect(toRegex).to.have.property('maxLen').that.is.an('number').equal(maxLen);
		// 上述语句证明了maxLen属性为数字类型，并且值等于预期值

		// 重写，即重新为maxLen属性赋值
		function rewrite() {
			toRegex.maxLen = 0;
		}
		// 前半句说明 maxLen 不能被重写，后半句证明maxLen依然等于预期值
		expect(rewrite).to.not.change(toRegex, 'maxLen').and.that.equal(maxLen);
	});

	it('获取属性flags，它是一个数组，不能被修改，而且等于预期值', function () {
		expect(toRegex).to.have.property('flags').that.is.an('array').deep.equal(flags);
		function rewrite() {
			toRegex.flags = null;
		}
		expect(rewrite).to.not.change(toRegex, 'flags').and.that.is.deep.equal(flags);
	});

	it('获取属性cache，它是一个map，可以使用map的一系列操作\n', function () {
		expect(toRegex).to.have.property('cache').that.is.a('map');
		toRegex.cache.set('demo', 123);
		expect(toRegex.cache).have.key('demo'); // 说明 cache可以使用 Map 所有API
		expect(toRegex.cache.get('demo')).is.equal(123);
	});

	describe('方法getVaildFlags，只接收一个字符串类型参数，并且返回有效的 JavaScript RegExp flags', function () {

		it('当传入的参数类型不正确时，返回一个空字符串', function () {
			for (const arg of [null, undefined, 12, {}, [], true]) {
				expect(toRegex.getVaildFlags(arg)).is.a('string').that.equal('');
			}
		});

		it('当传入正确的无效的flags字符串，返回一个空字符串', function () {
			expect(toRegex.getVaildFlags('a')).is.a('string').that.equal('');
		});

		it('从传入的字符串中过滤出了JavaScript RegExp支持的flags\n', function () {
			const flag = toRegex.getVaildFlags('aigs');

			expect(flag).is.equal('ig');
			expect(flags).to.have.include.members(flag.split('')); // 标准的flags中包含了用户传入的
		});
	});

	describe('方法setVaildFlags，只接收一个字符串类型的参数，' +
		'它将会改变flags属性的值，而目前JavaScript RegExp支持的flags都已经列举了，因此flags属性值不变', function () {

			it('方法参数类型检测，当传入非字符串类型时，flags属性不会有任何变化', function () {
				const err = new TypeError('这个函数只接收一个字符串参数');

				for (const arg of [null, undefined, 12, {}, [], true]) {
					try {
						toRegex.setVaildFlags(arg);
					} catch (errs) {
						expect(errs.name).is.equal(err.name);
						expect(errs.message).is.equal(err.message);
					}
				}
				expect(toRegex.flags).is.deep.equal(flags);
			});

			it('当传入的字符串不是有效的Javascript RegExp flags时，将返回false', function () {
				for (const f of 'xpda') {
					expect(toRegex.setVaildFlags(f)).is.equal(false);
				}
				expect(toRegex.flags).is.deep.equal(flags);
			});

			it('当传入的flag已经存在了，将会返回true，不会修改 flags 属性\n', function () {
				for (const f of flags) {
					expect(toRegex.setVaildFlags(f)).is.equal(true);
				}
				expect(toRegex.flags).is.deep.equal(flags);
			});
		});

	describe('方法 getOptions ，获取用户当前使用的配置项，此方法只支持纯对象配置项，否则返回默认配置项', function () {

		it('当传入的配置项非纯对象时，返回值与默认配置相同', function () {
			for (const arg of [null, undefined, 1, 's', function () { }]) {
				expect(toRegex.getOptions(arg)).is.deep.equal(defaults);
			}
		});

		it('配置项 cache , 当传入非真时，预期得到一个false', function () {
			for (const bool of [true, false]) {
				const actualOptions = toRegex.getOptions({ cache: bool });

				expect(actualOptions.cache).is.equal(bool);
			}
		});

		it('配置项 terror, 当传入非真时，预期得到一个false', function () {
			for (const bool of [true, false]) {
				const actualOptions = toRegex.getOptions({ terror: bool });

				expect(actualOptions.terror).is.equal(bool);
			}
		});

		it('配置项 strict strictStart strictEnd 三者间存在耦合，当且仅当strict为true时，strictStart、strictEnd才会分别拿到值：^、$,否则为空', function () {
			const preOptions = {
				strict: true,
				strictStart: true,
				strictEnd: true
			};
			let actualOptions = toRegex.getOptions(preOptions);

			expect(actualOptions.strictStart).is.equal('^');
			expect(actualOptions.strictEnd).is.equal('$');

			preOptions.strictStart = false;
			actualOptions = toRegex.getOptions(preOptions);
			expect(actualOptions.strictStart).is.equal('');

			preOptions.strictEnd = false;
			actualOptions = toRegex.getOptions(preOptions);
			expect(actualOptions.strictEnd).is.equal('');

			preOptions.strict = false;
			actualOptions = toRegex.getOptions(preOptions);

			expect(actualOptions.strictStart).is.equal('');
			expect(actualOptions.strictEnd).is.equal('');
		});

		it('配置项	flags, 传入有效的flags时，得到一个与有效flags值的子集，某则', function () {
			const preFlag = 'gim';
			const actualOptions = toRegex.getOptions({ flags: preFlag });

			expect(actualOptions.flags).is.equal(preFlag);
		});

		it('配置项negate控制strictNegate、strictNegateEnd，当且仅当negate为真时，strictNegate、strictNegateEnd才会获得相应的值', function () {

			const preOptions = {
				negate: true,
				strictNegate: true,
				strictNegateEnd: '+'
			};
			let actualOptions = toRegex.getOptions(preOptions);

			expect({
				negate: actualOptions.negate,
				strictNegate: actualOptions.strictNegate,
				strictNegateEnd: actualOptions.strictNegateEnd
			}).is.deep.equal(preOptions);

			preOptions.negate = false;

			actualOptions = toRegex.getOptions(preOptions);

			expect({
				negate: actualOptions.negate,
				strictNegate: actualOptions.strictNegate,
				strictNegateEnd: actualOptions.strictNegateEnd
			}).is.deep.equal({
				negate: false,
				strictNegate: false,
				strictNegateEnd: ''
			});

		});
	});

	describe('方法 complie ，根据用户传入的模式字符，生成对应的正则', function () {

		it('函数只接收：正则、数字、字符串、数组，此4种类型的参数，除此之外会抛出一个错误，反之将会得到一个正确', function () {

			for (const arg of [{}, null, undefined, Symbol, true, Date]) {

				try {
					toRegex.complie(arg, defaults);
				} catch (error) {
					expect(error.name).is.equal('TypeError');
					expect(error.message).is.equal('这个函数只接字符串、字符串数组、数字、正则表达式作为主参数');
				}
			}

			let regex = null;

			regex = toRegex.complie('abcd', defaults);
			expect(regex).instanceof(RegExp);

			regex = toRegex.complie(['a', 'b', 'c', 'd'], defaults);
			expect(regex).instanceof(RegExp);

		});

		it('传入一个正则时，配置项被忽略 ，返回原有的正则', function () {
			const oregx = /\s+/g;
			const regex = toRegex.complie(oregx);

			expect(regex).is.deep.equal(oregx);
			expect(regex).instanceof(RegExp);
			expect(regex.test('a')).is.equal(false);
			expect(regex.test('a b c')).is.equal(true);
		});

		describe('传入一个数字时，正确返回一个正则，当启用不同配置项时，都应该返回正确的', function () {

			const num = 1234;
			const str = 'abcd ' + num + ' 3455 ' + num;

			it('基础型，全局匹配', function () {
				const regex = toRegex.complie(num, { flags: 'g' });

				expect(regex).instanceof(RegExp);
				expect(regex.test(str)).is.equal(true);
				expect(str.replace(regex, '')).is.equal('abcd  3455 ');
			});

			it('捕获型，全局匹配', function () {
				const regex = toRegex.complie(num, { flags: 'g', negate: true, strictNegate: true });

				expect(regex).instanceof(RegExp);
				expect(regex.test(str)).is.equal(true);
			});

		});
	});
});
