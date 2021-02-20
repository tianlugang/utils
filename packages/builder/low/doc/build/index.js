const fs = require('fs');
const path = require('path');
const esprima = require('esprima');
const utils = require('./utils');
const errors = require('./error');
const extract = require('./extract');
const template = require('./template');
const commentParser = require('./parser/comment');

fs.readdir(utils.MODULE_CODE_ROOT, function(err, paths) {
    if(err) {
        throw err;
    }

    utils.mkdirSync(utils.MODULE_ROOT);
    paths.forEach(createModule);

    errors.throw();
});

function createModule(filename) {
    const { name, ext } = path.parse(filename);

    if(utils.isEcmaScript(ext)) {
        const src = utils.getSrcPath(filename);
        const model = {
            src,
            true: null, // whether it(current file) is a module, and not a dependencies or util
            code: utils.readFileSync(src), // module's source code
            path: utils.getDestPath(name), // module's path
            main: utils.getDestPath(name, 'index.js'), // module's entry
            name: null, // module's name
            desc: null, // module's description
            version: null, // module's version
            keyword: null, // module's keyword
            dependencies: null, // module's dependencies
            explain: null, // module's instructions
            example: null // module's example
        };
        parseComment(model); // parse file header comments
        verifyModule(model); // check the model whether is a module or other
        
        if(model.true) {
            formatModule(model); // format module info
            generateModule(model); // generate module
        }
    }
}

// judge whether it is a modules
function verifyModule(model) {
    model.true = [model.name, model.desc, model.keyword, model.version].every(Array.isArray);
}

// format module's data
function formatModule(model) {
    model.name = extract.trimAll(model.name);
    model.desc = model.desc.map(v => v.trim());
    model.version = extract.trimAll(model.version);
    model.keyword = extract.trimPart(model.keyword);
    model.dependencies = extract.parseDependencies(model.dependencies);
    model.example = model.example.map(v => '\n' + v).join('');

    utils.renderTemplate(template.package, model);
    utils.renderTemplate(template.readme, model);
}

// generate module
function generateModule(model) {
    utils.rmdirSync(model.path);
    utils.mkdirSync(model.path);
    utils.writeFileSync(model.main, model.code);
    utils.writeFileSync(model.package.path, model.package.code);
    utils.writeFileSync(model.readme.path, model.readme.code);
    copyModuleOwnDependencies(model);
}

function copyModuleOwnDependencies(model) {
    if(model.dependencies) {
        const { own } = model.dependencies;
        if(own.length) {
            own.forEach(file => {
                try {
                    const src = utils.getSrcPath(file);
                    const dest = utils.getDestPath(model.name, file);
                    const stat = fs.statSync(src);

                    if(stat.isFile()) {
                        utils.copyFileSync(src, dest);
                    } else if(stat.isDirectory()) {
                        utils.copyDirSync(src, dest);
                    }
                }catch(error) {
                    error.name = 'InvalidOwnDependencies';
                    errors.collect(error, model);
                }
            });
        }
    }
}

// handler header comments
function parseComment(model) {
    const { comments } = esprima.parseScript(model.code, { comment: true });
    const comment = comments[0];

    // babel-plugin-czq-import
    console.log(commentParser.parse(comment));
    if(comment && comment.type === 'Block') {
        const values = extract.format(comment.value);
        const ignore = /^(\s*|\*)$/;
        if(values.length > 1) {
            for(let i = 0, value, field, token, array; i < values.length; i++) {
                value = values[i].replace(/^\s/, '');
                if(ignore.test(value) || ignore.test(value.trim())) {
                    continue;
                }
                field = extract.split(value);

                if(field) {
                    if(extract.valid(field[1])) {
                        token = field[1];
                        array = value.split('@' + token).filter(v => v !== '');
                        model[token] = model[token] || array;
                        continue;
                    }
                } else if(token) {
                    model[token] = model[token] || [];
                    model[token].push(value);
                    continue;
                }
                model.explain = model.explain || [];
                model.explain.push(value);
            }
        }
    }
}
