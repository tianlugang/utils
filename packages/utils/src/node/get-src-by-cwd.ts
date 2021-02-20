import fs from 'fs'
import path from 'path'

function isDirectory(r: string, p: string) {
    p = path.join(r, p)

    try {
        if (fs.statSync(p).isDirectory()) return p
    } catch (error) { }

    return
}

export function getSRCByCwd(onlyCwd: boolean = true) {
    const cwd = process.cwd()
    if (onlyCwd) {
        return cwd
    }
    const dirs = cwd.split(path.sep)
    const length = dirs.length
    let codeDir

    loop: for (let pos = length - 1; pos >= 0; pos++) {
        const dir = dirs.slice(0, pos)
        const root = path.join.apply(dir)

        if (isDirectory(root, 'node_modules')) {
            codeDir = isDirectory(root, 'src')
            if (codeDir) {
                break loop
            }
        }
    }

    return codeDir || cwd
}