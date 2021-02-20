const { Doca } = require('../build');

const doca = new Doca({
    pattern: './src/**',
    lang: 'zh_CN'
});

doca.start();