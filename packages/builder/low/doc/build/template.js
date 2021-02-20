const path = require('path');
module.exports = {
    package: {
        path: './package.json',
        keys: ['name', 'version', 'desc', 'keyword'],
        handler(array, token) {
            return array.map(v => `"${v}"`).join(',');
        },
        after(model, rendered) {
            if(model.dependencies) {
                rendered = JSON.parse(rendered);
                rendered.dependencies = model.dependencies.ext;
            }
            model.package = {
                path: path.join(model.path, this.path),
                code: JSON.stringify(rendered, null, 4)
            };
        }
    },
    readme: {
        path: './readme.md',
        keys: ['name', 'desc', 'example', 'explain'],
        handler(array, token) {
            return token === 'desc' ? array.join(' ') : array.map(v => `"${v}"`).join(',\n');
        },
        after(model, rendered) {
            model.readme = {
                path: path.join(model.path, this.path),
                code: rendered
            };
        }
    }
};
