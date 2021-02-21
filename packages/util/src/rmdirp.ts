import fs from 'fs'
import path from 'path'

export function rmdirpSync(src: string, onlyClean: boolean = true) {
    function loop(dest: string) {
        const stat = fs.statSync(dest);

        if (stat.isDirectory()) {
            fs.readdirSync(dest).forEach(name => {
                loop(path.join(dest, name));
            });

            if (onlyClean && dest === src) {
                return;
            }

            fs.rmdirSync(dest);
        } else {
            fs.unlinkSync(dest);
        }
    }

    try {
        loop(src);
    } catch (error) {
        throw error;
    }
}