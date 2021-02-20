const pa = require('path');
const path = require('../node-root-dir');

const projectRoot = pa.join(__dirname, '..');
const srcDirRoot = pa.join(projectRoot, 'src');

describe('Utils.path', function() {
    test('path.root is not project root', function() {
        expect(path.root === projectRoot).toBeTruthy();
    });


    test('path.resolve Incorrect execution results', function() {
        expect(path.resolve('src')).toStrictEqual(srcDirRoot);
    });
});
