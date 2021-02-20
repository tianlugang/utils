const fs = require('fs');
const path = require('path');
const REGEX_SCRIPTS = /\.(js|es|ts)(\?.*)?$/;
const MODULE_ROOT = path.join(__dirname, '../packages');
const MODULE_CODE_ROOT = path.join(__dirname, '../src');
const TEMPLATE_ROOT = path.join(__dirname, './template');

function noop() { }

function readFileSync(filepath) {
    return fs.readFileSync(filepath, 'utf-8');
}

function writeFileSync(filepath, content) {
    return fs.writeFileSync(filepath, content);
}

function copyFileSync(src, dest) {
    return fs.copyFileSync(src, dest);
}

function mkdirSync(dirpath) {
    try {
        fs.mkdirSync(dirpath);
    }catch(err) {
        if(err.code !== 'EEXIST') {
            throw err;
        }
    }
}

function rmdirSync(dest) {
    if(!fs.existsSync(dest)) {
        return;
    }

    if(fs.statSync(dest).isFile()) {
        return fs.unlinkSync(dest);
    }

    function loop(dest) {
        const paths = fs.readdirSync(dest);

        paths.forEach(name => {
            const src = path.join(dest, name);
            const stat = fs.statSync(src);

            if(stat.isFile()) {
                fs.unlinkSync(src);
            } else if(stat.isDirectory()) {
                loop(src);
            }
        });

        fs.rmdirSync(dest);
    }

    try {
        loop(dest);
    }catch(error) {
        throw error;
    }
}

/**
 * copy directory
 *
 * @param {String} from
 * @param {String} to
 */
function copyDirSync(from, to) {
    mkdirSync(to);
    const paths = fs.readdirSync(from);

    paths.forEach(name => {
        const src = path.join(from, name);
        const dest = path.join(to, name);
        const stat = fs.statSync(src);

        if(stat.isFile()) {
            fs.writeFileSync(dest, fs.readFileSync(src));
        } else if(stat.isDirectory()) {
            copyDirSync(src, dest);
        }
    });
}

// is javascript file
function isEcmaScript(ext) {
    return REGEX_SCRIPTS.test(ext);
}

// get file source-code path
function getSrcPath(...filepath) {
    return path.join(MODULE_CODE_ROOT, ...filepath);
}

// get package's path
function getDestPath(...filepath) {
    return path.join(MODULE_ROOT, ...filepath);
}

// get the template's path
function getTemplatePath(...filepath) {
    return path.join(TEMPLATE_ROOT, ...filepath);
}

// render template of path
function renderTemplate(options, model) {
    options = options || {};
    const filepath = getTemplatePath(options.path);
    let template = readFileSync(filepath);
    const handler = typeof options.handler === 'function' ? options.handler : noop;
    const after = typeof options.after === 'function' ? options.after : noop;

    options.keys.forEach(token => {
        template = template.replace(
            new RegExp('\\${' + token + '\\}', 'gi'),
            Array.isArray(model[token]) ?
                handler.call(options, model[token], token) :
                model[token]
        );
    });
    after.call(options, model, template);

    return template;
}

module.exports = {
    MODULE_ROOT,
    MODULE_CODE_ROOT,
    readFileSync,
    writeFileSync,
    copyFileSync,
    copyDirSync,
    mkdirSync,
    rmdirSync,
    isEcmaScript,
    getSrcPath,
    getDestPath,
    getTemplatePath,
    renderTemplate
};
