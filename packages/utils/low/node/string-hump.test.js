const hump = require('../string-hump');

describe('Utils.hump: String humpify', function() {
    const incorrect = [
        undefined,
        null,
        true,
        1,
        function() { },
        {},
        '',
        '   '
    ];

    for(const data of incorrect) {
        test('hump ' + data + ' is not strict equal ' + data, function() {
            expect(hump(data)).toStrictEqual(data);
        });
    }

    const correct = {
        'string.group-by.size': 'stringGroupBySize',
        '2_string': '2String',
        'test..get': 'testGet',
        'test_.get': 'testGet',
        '/test/get': 'testGet',
        '/test/ get': 'testGet',
        '/test / get': 'testGet',
        '/test / .get': 'testGet',
        '/test / .get ': 'testGet',
        '/test / .-get ': 'testGet',
        '/test / .\\-get ': 'testGet',
        'i get city_chain xian': 'iGetCityChainXian'
    };

    for(const target in correct) {
        const result = correct[target];
        test('hump ' +target + ' is not strict equal ' + result, function(){
            expect(hump(target)).toStrictEqual(result);
        });
    }
});
