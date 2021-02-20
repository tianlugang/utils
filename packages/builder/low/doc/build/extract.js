const REGEX_FIELDS = /(name|version|desc|dependencies|keyword|example)/i;
const REGEX_TOKENS = /^@([A-Za-z0-9]+)/i;
const REGEX_SPLITER = /\r\n\s+\*/;

module.exports = {

    // split doc-comments
    format(value) {
        return value.split(REGEX_SPLITER);
    },

    split(value) {
        return REGEX_TOKENS.exec(value);
    },

    valid(value) {
        return REGEX_FIELDS.test(value);
    },

    // array join and trim all
    trimAll(array) {
        return array.join('').replace(/\s+/g, '');
    },

    // array join and part of comma
    trimPart(array) {
        return array.join('').trim().split(/\s+/);
    },

    // dependencies
    parseDependencies(array) {
        if(Array.isArray(array)) {
            const deps = { ext: {}, own: [] };
            array.forEach(value => {
                // name: version -> eg: query:^3.2.0
                // path -> eg: ./to-string.js
                const dep = value.split(':').map(v => v.trim()).filter(v => v !== '');

                if(dep[1]) {
                    deps.ext[dep[0]] = dep[1];
                } else {
                    deps.own.push(dep[0]);
                }
            });

            return deps;
        }
    }
};
