// logDev.log(1, 2, 3);
// logDev.warn('sss', function () { });
// logDev.info('Hello world ! --color: green');
function print(code: number, title: string, ...args: any[]) {
    console.log();
    title = logDev.prefix + title;

    if (logDev.noColor) {
        return console.log(title, ...args);
    }

    args.forEach(function forEach(value) {
        const type = typeof value;

        switch (type) {
            case 'bigint':
            case 'boolean':
            case 'number':
            case 'string':
            case 'symbol':
            case 'undefined':
                console.log(`\u001b[${code || 33}m${title} ${value} \u001b[39m`);
                break
            default: {
                console.log(`\u001b[${code || 33}m${title} VALUE-TYPE: ${type} \u001b[39m`, value);
            }
        }
    });
}

/**
 * @name logDev
 * @version 1.0.0
 * @description 终端日志
 * @keyword log logger-dev log-dev dev-log dev-logger nodejs print
 * @dependencies
 * @example
 *    // [logDev] this is a warn info. --color: yellow
 *    logDev.warn('this is a warn info.');
 *    // [logDev] this is a error info. --color: red
 *    logDev.error('this is a error info.');
 *    // [logDev] this is a valid info. --color: green
 *    logDev.info('this is a valid info.');
 * 
 *    logDev.prefix = 'Hello';
 *    // Hello world ! --color: green
 *    logDev.info('world !');
 */
export const logDev = {
    warn(...arg: any[]) {
        print(33, 'WARN', ...arg);
    },
    info(...arg: any[]) {
        print(32, 'INFO', ...arg);
    },
    error(...arg: any[]) {
        print(31, 'ERROR', ...arg);
    },
    log(...arg: any[]) {
        print(0, 'LOG', ...arg);
    },
    prefix: 'DEV-',
    noColor: false
};
