const pa = require('path');
const getRootDir = require('./node-root-dir');

describe('Utils.getRootDir', function() {
    test('That is not this project root', function() {
        expect(getRootDir() === pa.join(__dirname, '..')).toBeTruthy();
    });
});
