const { expect } = require('chai');
const chalk = require('chalk');
const isUrl = require('../is-url');

/* eslint no-console: 0 */
describe('判断一个字符串是否为URL', function() {
    const invalid = [
        'http://',
        'http://google',
        'http://google.',
        'google',
        'google.com',
        1111,
        false,
        null,
        []
    ];

    for(let url of invalid) {
        it(`无效的URL： ${chalk.red(url)} 应该会返回false`, function() {
            expect(isUrl(url)).to.equal(false);
        });
    }

    const valid = [
        'http://google.com',
        'https://google.com',
        'ftp://google.com',
        'http://www.google.com',
        'http://google.com/something',
        'http://google.com?q=query',
        'http://google.com#hash',
        'http://google.com/something?q=query#hash',
        'http://google.co.uk',
        'http://www.google.co.uk',
        'http://google.cat',
        'https://d1f4470da51b49289906b3d6cbd65074@app.getsentry.com/13176',
        'http://0.0.0.0',
        'http://localhost',
        'postgres://u:p@example.com:5702/db',
        'redis://:123@174.129.42.52:13271',
        'mongodb://u:p@example.com:10064/db',
        'ws://chat.example.com/games',
        'wss://secure.example.com/biz',
        'http://localhost:4000',
        'http://localhost:342/a/path',
        '//google.com'
    ];

    for(let url of valid) {
        it(`合法的URL： ${chalk.green(url)} 应该会返回true `, function() {
            expect(isUrl(url)).to.equal(true);
        });
    }
});
