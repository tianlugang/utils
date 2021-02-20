/* eslint no-console: 0*/
const colors = require('../src/colorize');
const errors = [];

module.exports = {

    /**
     * throw error
     */
    throw() {
        if(errors.length) {
            console.log(colors`${'yellow'}Packages build finish, but have errors: \n`);
            errors.forEach(error => {
                console.log(colors`${'red'}${error.stack}`);
                const keys = Object.keys(error);
                if(keys.length) {
                    console.log(colors`${'red'}ErrorHint:`);
                    keys.forEach(key => {
                        console.log(colors`    ${'red'}${key} ${'white'}${error[key]}`);
                    });
                }
            });
        } else {
            console.log(colors`${'green'}Packages build finish.`);
        }
    },

    /**
     * push error to errors
     * @param {Error} error
     * @param {Object} model
     */
    collect(error, model) {
        if(model) {
            if(model.path) {
                error.modulePath = model.path;
            }
        }
        errors.push(error);
    }
};
