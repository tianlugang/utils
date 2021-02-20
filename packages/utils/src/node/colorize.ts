const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
const ANSI = {
    // styles
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],

    // bgColors
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],

    // colors
    white: [37, 39],
    grey: [90, 39],
    gray: [90, 39],
    black: [90, 39],
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [91, 39],
    yellow: [33, 39]
};

type IANSIKey = keyof typeof ANSI;

// add ANSI to `str`
function add(key: IANSIKey, ...args: string[]) {
    const ansi = ANSI[key];
    if (!ansi) {
        return args.join('');
    }

    return `\x1B[${ansi[0]}m` + args.join('') + `\x1B[${ansi[1]}m`;
}

// delete ansi
function rm(str: string) {
    return str.replace(ANSI_REGEX, () => '');
}

function generate(style: IANSIKey) {
    return function colorized(strings: string | TemplateStringsArray, ...keys: IANSIKey[]) {
        if (typeof strings === 'string') {
            return add(style, strings, ...keys);
        }

        if (strings.raw) {
            return add(style, strings[0], ...keys.map((key, i) => key + strings[i + 1]));
        }

        return strings;
    };
}

// colorize
export function colorize(strings: string | TemplateStringsArray, ...keys: IANSIKey[]) {
    if (typeof strings === 'string') {
        const style = keys.pop() || 'green';

        return add(style, strings, ...keys);
    }

    if (strings.raw) {
        let style: IANSIKey;
        return [strings[0], ...keys.map((key, i) => {
            const str = strings[i + 1];
            if (key in ANSI) {
                style = key;
                return str.length ? add(style, str) : '';
            }
            if (style) {
                return add(style, key, str);
            }
            return key + str;
        })].join('');
    }

    return strings
}

colorize.rm = rm;
colorize.add = add;
colorize.reset = generate('reset');
colorize.bold = generate('bold');
colorize.dim = generate('dim');
colorize.italic = generate('italic');
colorize.underline = generate('underline');
colorize.inverse = generate('inverse');
colorize.hidden = generate('hidden');
colorize.strikethrough = generate('strikethrough');

// bgColors
colorize.bgBlack = generate('bgBlack');
colorize.bgRed = generate('bgRed');
colorize.bgGreen = generate('bgGreen');
colorize.bgYellow = generate('bgYellow');
colorize.bgBlue = generate('bgBlue');
colorize.bgMagenta = generate('bgMagenta');
colorize.bgCyan = generate('bgCyan');
colorize.bgWhite = generate('bgWhite');

// colors
colorize.white = generate('white');
colorize.grey = generate('grey');
colorize.gray = generate('gray');
colorize.black = generate('black');
colorize.blue = generate('blue');
colorize.cyan = generate('cyan');
colorize.green = generate('green');
colorize.magenta = generate('magenta');
colorize.red = generate('red');
colorize.yellow = generate('yellow');
