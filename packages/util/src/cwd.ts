import os from 'os'
import fs from 'fs'
import path from 'path'

export const getCwd = () => {
    const lastIdxOfNms = __dirname.lastIndexOf('node_modules');

    if (lastIdxOfNms !== -1) {
        return __dirname.substring(0, lastIdxOfNms);
    }

    const paths = (process.mainModule || module).paths;
    let maxLength = 0, maxIdx = -1;

    for (let idx = 0, nms; idx < paths.length; idx++) {
        nms = paths[idx];

        if (fs.existsSync(nms)) {
            if (maxLength < nms.length) {
                maxIdx = idx;
                maxLength = nms.length;
            }
        }
    }

    if (maxIdx > -1) {
        return path.join(paths[maxIdx], '..');
    }

    return process.cwd();
}

export const setCwd = (dir: string) => {
    if (!dir) {
        dir = os.homedir();
    }

    if (dir === '-') {
        if (!process.env.PREV_PWD) {
            process.stdout.write('\u001b[31m' + 'could not find previous directory.' + '\u001b[39m');
        } else {
            dir = process.env.PREV_PWD;
        }
    }

    try {
        const curDir = process.cwd();

        process.chdir(dir);
        process.env.PREV_PWD = curDir;
    } catch (e) {
        let err;

        try {
            fs.statSync(dir);
            err = 'not a directory: ' + dir;
        } catch (ex) {
            err = 'no such file or directory: ' + dir;
        }
        if (err) {
            process.stdout.write('\u001b[31m' + err + '\u001b[39m');
        }
    }
}