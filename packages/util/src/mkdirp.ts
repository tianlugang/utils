import fs, { PathLike, MakeDirectoryOptions, Mode, NoParamCallback } from 'fs'
import { noop } from '@tlg/utils'

type Callback = { (err: NodeJS.ErrnoException | null, successfully: boolean): void }

const m0777 = parseInt('0777', 8)
export function mkdirp(path: PathLike, opts: NoParamCallback | Callback | Mode | MakeDirectoryOptions | null = m0777, cb: Callback | NoParamCallback = noop) {
    if (typeof opts === 'number' || typeof opts === 'string') {
        opts = opts || m0777
    } else if (typeof opts === 'object' && opts) {
        if (!opts.mode) {
            opts.mode = m0777
        }
    } else if (typeof opts === 'function' || opts == null) {
        cb = opts || noop
        opts = m0777
    }

    fs.mkdir(path, opts, err => {
        if (!err) {
            return cb(null, true)
        }

        if (err.code === 'ENOENT') {
            mkdirp(path, {
                mode: opts && (typeof opts === 'object' ? opts.mode : typeof opts !== 'function' ? opts : null) || m0777,
                recursive: true
            }, cb)
        } else {
            fs.stat(path, (err2, stat) => {
                if (err2 || !stat.isDirectory()) cb(err, false)
                else cb(null, true)
            })
        }
    })
}

function sync(path: PathLike, opts: Mode | MakeDirectoryOptions | null = m0777): boolean {
    if (opts == null) {
        opts = m0777
    } else if (typeof opts === 'number' || typeof opts === 'string') {
        opts = opts || m0777
    } else if (typeof opts === 'object' && !opts.mode) {
        opts.mode = m0777
    }

    try {
        fs.mkdirSync(path, opts)
        return true
    } catch (err) {
        if (err.code === 'ENOENT') {
            return sync(path, {
                mode: opts && (typeof opts === 'object' ? opts.mode : typeof opts !== 'function' ? opts : null) || m0777,
                recursive: true
            })
        }

        try {
            const stat = fs.statSync(path)
            if (!stat.isDirectory()) {
                return false
            }
        } catch (err2) {
            throw err2
        }
    }

    return false
}

// import util from 'util'
export declare namespace mkdirp {
    function __promisify__(path: PathLike, opts?: Mode | MakeDirectoryOptions | null): Promise<boolean>
    function sync(path: PathLike, opts?: Mode | MakeDirectoryOptions | null): boolean
}

mkdirp.sync = sync