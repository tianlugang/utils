const treeify = require('../to-tree');
const data = [
    { id: 1, name: '陕西', pid: 0 },
    { id: 2, name: '西安', pid: 1 },
    { id: 3, name: '宝鸡', pid: 1 },
    { id: 4, name: '莲湖区', pid: 2 },
    { id: 5, name: '广东', pid: 0 },
    { id: 6, name: '深圳', pid: 5 },
    { id: 7, name: '福田区', pid: 6 },
    { id: 8, name: '龙华新区', pid: 6 },
    { id: 9, name: '渭滨区', pid: 3 },
    { id: 10, name: '广州', pid: 5 },
    { id: 11, name: '天河区', pid: 10 }
];
const target = [
    {
        title: '陕西',
        children: [
            { title: '西安', children: [{ title: '莲湖区' }] },
            { title: '宝鸡', children: [{ title: '渭滨区' }] }
        ]
    },
    {
        title: '广东',
        children: [
            { title: '深圳', children: [{ title: '福田区' }, { title: '龙华新区' }] },
            { title: '广州', children: [{ title: '天河区' }] }
        ]
    }
];

test('target is deep equal the result', function() {
    const tree = treeify(data, {
        self: 'id',
        parent: 'pid',
        children: 'children',
        callback(column, node) {
            node.title = column.name;
        }
    });
    expect(tree).toEqual(target);
});
