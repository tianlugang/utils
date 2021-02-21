
import fs, { Mode, NoParamCallback, Stats, BigIntStats, BigIntOptions, StatOptions, PathLike } from 'fs'
import path from 'path'
import { never, noop } from '@tlg/utils'
import { mkdirp } from './mkdirp'
import { isSubdir } from './is-subdir'

type IOptions = Partial<IContext> & StatOptionsExtra | IFilter | NoParamCallback
type IFilter = {
    (src: string, dest: string): boolean
}
type IContext = {
    dereference: boolean
    overwrite: boolean
    filter: IFilter
    mode?: Mode
    bigint?: boolean
}
type ErrnoException = NodeJS.ErrnoException | null
type StatOptionsExtra = StatOptions | BigIntOptions | undefined
type StatsExtra = Stats | BigIntStats
type StatsCallback = {
    (err: ErrnoException, stats: StatsExtra): void
}
type CheckStatsCallback = {
    (err: ErrnoException, srcStat: StatsExtra, destStat?: StatsExtra): void
}

function isFile(stat?: StatsExtra) {
    return stat && (stat.isFile() || stat.isCharacterDevice() || stat.isBlockDevice())
}

function mkDirAndCopy(srcStat: StatsExtra, src: string, dest: string, ctx: IContext, cb: NoParamCallback) {
    mkdirp(dest, (err: NodeJS.ErrnoException | null) => {
        if (err) return cb(err)
        copyDir(src, dest, ctx, () => {
            if (err) return cb(err)
            fs.chmod(dest, srcStat.mode as any, cb)
        })
    })
}

function copyDir(src: string, dest: string, ctx: IContext, cb: NoParamCallback) {
    fs.readdir(src, (err, items) => {
        if (err) return cb(err)
        copyDirItems(items, src, dest, ctx, cb)
    })
}

function copyDirItems(items: string[], src: string, dest: string, ctx: IContext, cb: NoParamCallback) {
    const item = items.pop()
    if (!item) return cb(null)
    copyDirItem(items, item, src, dest, ctx, cb)
}

function copyDirItem(items: string[], item: string, src: string, dest: string, ctx: IContext, cb: NoParamCallback) {
    const srcItem = path.join(src, item)
    const destItem = path.join(dest, item)
    checkStats(srcItem, destItem, ctx, (err, srcStat, destStat) => {
        if (err) return cb(err)
        startCopy(srcItem, destItem, srcStat, destStat, ctx, (err) => {
            if (err) return cb(err)
            return copyDirItems(items, src, dest, ctx, cb)
        })
    })
}

function startCopy(src: string, dest: string, srcStat: StatsExtra, destStat: StatsExtra | undefined, ctx: IContext, cb: NoParamCallback) {
    if (ctx.filter(src, dest)) {
        return cb(null)
    }

    if (srcStat.isDirectory()) {
        if (!destStat) {
            return mkDirAndCopy(srcStat, src, dest, ctx, cb)
        }

        if (!destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`))
        }

        return copyDir(src, dest, ctx, cb)
    }

    if (isFile(srcStat)) {
        if (isFile(destStat)) {
            return copyExistsFile(src, dest, ctx.overwrite, cb, srcStat)
        }

        return copyFile(src, dest, cb, srcStat)
    }

    if (srcStat.isSymbolicLink()) {
        return copyLink(src, dest, ctx.dereference, cb, destStat)
    }
}

function getStat(src: string, ctx: IContext, cb: StatsCallback) {
    fs.access(src, (err) => {
        if (err) {
            return (cb as NoParamCallback)(err)
        }
        const args: any = [src]
        const onEnd = (err: ErrnoException, stats: StatsExtra) => {
            if (err) return (cb as NoParamCallback)(err)
            cb(null, stats)
        }

        if (typeof ctx.bigint !== 'undefined') {
            args.push({
                bigint: ctx.bigint
            })
        }
        args.push(onEnd)
        const fstat = ctx.dereference ? fs.stat : fs.lstat

        fstat.apply(null, args)
    })
}

function checkStats(src: string, dest: string, ctx: IContext, cb: CheckStatsCallback) {
    getStat(src, ctx, (err, srcStat) => {
        if (err) return (cb as NoParamCallback)(err)
        getStat(dest, ctx, (err, destStat) => {
            if (err && err.code !== 'ENOENT') {
                return (cb as NoParamCallback)(err)
            }

            cb(null, srcStat, destStat)
        })
    })
}

function checkParentStats(srcStat: StatsExtra, src: string, dest: string, ctx: IContext, cb: NoParamCallback) {
    const srcParent = path.resolve(path.dirname(src))
    const destParent = path.resolve(path.dirname(dest))
    if (destParent === srcParent || destParent === path.parse(destParent).root) return cb(null)

    getStat(destParent, ctx, (err, destStat) => {
        if (err) {
            if (err.code === 'ENOENT') return cb(null)
            return cb(err)
        }

        if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
            return cb(new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`))
        }

        return checkParentStats(srcStat, src, destParent, ctx, cb)
    })
}

function cpFile(srcStat: StatsExtra, src: PathLike, dest: PathLike, cb: NoParamCallback) {
    fs.copyFile(src, dest, (err) => {
        if (err) return cb(err)
        fs.chmod(dest, srcStat.mode as any, err => {
            if (err) return cb(err)

            return cb(null)
        })
    })
}

function copyExistsFile(src: PathLike, dest: PathLike, overwrite: boolean, cb: NoParamCallback, srcStat?: StatsExtra) {
    if (overwrite) {
        return fs.unlink(dest, (err) => {
            if (err) {
                return cb(err)
            }

            copyFile(src, dest, cb, srcStat)
        })
    }

    copyFile(src, dest, cb, srcStat)
}

export function copyFile(src: PathLike, dest: PathLike, cb: NoParamCallback, srcStat?: StatsExtra) {
    if (srcStat) {
        return cpFile(srcStat, src, dest, cb)
    }

    fs.stat(src, (err, srcStat) => {
        if (err) return cb(err)
        cpFile(srcStat, src, dest, cb)
    })
}

export function copyLink(src: PathLike, dest: PathLike, dereference: boolean, cb: NoParamCallback, destStat?: Stats | BigIntStats) {
    fs.readlink(src, (err, resolvedSrc) => {
        if (err) return cb(err)
        if (dereference) {
            resolvedSrc = path.resolve(process.cwd(), resolvedSrc)
        }

        if (!destStat) {
            return fs.symlink(resolvedSrc, dest, cb)
        }

        fs.readlink(dest, (err, resolvedDest) => {
            if (err) {
                if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs.symlink(resolvedSrc, dest, cb)
                return cb(err)
            }

            if (dereference) {
                resolvedDest = path.resolve(process.cwd(), resolvedDest)
            }

            if (isSubdir(resolvedSrc, resolvedDest)) {
                return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`))
            }

            if (destStat.isDirectory() && isSubdir(resolvedDest, resolvedSrc)) {
                return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`))
            }

            fs.unlink(dest, err => {
                if (err) return cb(err)
                return fs.symlink(resolvedSrc, dest, cb)
            })
        })
    })
}

export function copy(src: string, dest: string, opts?: IOptions, cb: NoParamCallback = noop) {
    let dereference = true
    let overwrite = true
    let filter: IFilter = never
    let mode: Mode | undefined = undefined
    let bigint = undefined

    if (typeof opts === 'undefined') {
        cb = noop
    } else if (typeof opts === 'object' && opts) {
        dereference = !!opts.dereference
        overwrite = 'overwrite' in opts ? !!opts.overwrite : true
        filter = typeof opts.filter === 'function' ? opts.filter : never
        mode = opts.mode
        bigint = 'bigint' in opts ? !!opts.bigint : undefined
    } else if (typeof opts === 'function') {
        if (typeof cb === 'function') {
            filter = opts as IFilter
        } else {
            cb = opts as NoParamCallback
        }
    }

    const ctx = {
        dereference,
        overwrite,
        filter,
        mode,
        bigint
    }

    checkStats(src, dest, ctx, (err, srcStat, destStat?: StatsExtra) => {
        if (err) {
            return cb(err)
        }

        if (destStat && destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
            return cb(new Error('Source and destination must not be the same.'))
        }

        if (srcStat.isDirectory() && isSubdir(src, dest)) {
            return cb(new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`))
        }

        checkParentStats(srcStat, src, dest, ctx, (err) => {
            if (err) return cb(err)
            startCopy(src, dest, srcStat, destStat, ctx, cb)
        })
    })
}

// import util from 'util'
export declare namespace copy {
    function __promisify__(src: string, dest: string, opts?: Partial<IOptions>): Promise<void>
}