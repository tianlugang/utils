
import fs, { Mode, NoParamCallback, Stats, BigIntStats, BigIntOptions, StatOptions } from 'fs'
import path from 'path'
import { never } from '../base/never'
import { isSubdir } from './is-subdir'

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
type IOptions = (Partial<IContext> & (StatOptions | BigIntOptions)) | IFilter | NoParamCallback | undefined
type StatsExtra = Stats | BigIntStats

function isFile(stat: StatsExtra) {
    return stat.isFile() || stat.isCharacterDevice() || stat.isBlockDevice()
}

function getStatSync(src: string, ctx: Partial<IContext>): StatsExtra {
    fs.accessSync(src)

    const args: any = [src]
    const fstat = ctx.dereference ? fs.statSync : fs.lstatSync

    if (typeof ctx.bigint !== 'undefined') {
        args.push({ bigint: ctx.bigint })
    }

    return fstat.apply(null, args)
}

function getStatsSync(src: string, dest: string, ctx: Partial<IContext>) {
    const srcStat = getStatSync(src, ctx)
    let destStat!: StatsExtra

    try {
        destStat = getStatSync(dest, ctx)
    } catch (err) {
        if (err && err.code !== 'ENOENT') {
            throw err
        }
    }

    return { srcStat, destStat }
}

function checkParentStatSync(srcStat: StatsExtra, src: string, dest: string, ctx: IContext) {
    const srcParent = path.resolve(path.dirname(src))
    const destParent = path.resolve(path.dirname(dest))
    if (destParent === srcParent || destParent === path.parse(destParent).root) return
    let destStat!: StatsExtra

    try {
        destStat = getStatSync(destParent, ctx)
    } catch (err) {
        if (err.code === 'ENOENT') return
        throw err
    }

    if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
        throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`)
    }

    checkParentStatSync(srcStat, src, destParent, ctx)
}

function cpFileSync(src: string, dest: string, srcStat: StatsExtra, destStat?: StatsExtra, overwrite?: boolean) {
    if (destStat && overwrite && isFile(destStat)) {
        fs.unlinkSync(dest)
    }

    fs.copyFileSync(src, dest)
    fs.chmodSync(dest, srcStat.mode as any)
}

function copyDirSync(src: string, dest: string, srcStat: StatsExtra, destStat: StatsExtra | undefined, ctx: IContext) {
    if (destStat && !destStat.isDirectory()) {
        throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`)
    }

    if (!destStat) {
        fs.mkdirSync(dest, { recursive: true })
        fs.chmodSync(dest, srcStat.mode as any)
    }

    fs.readdirSync(src).forEach(item => {
        const srcItem = path.join(src, item)
        const destItem = path.join(dest, item)
        const { srcStat, destStat } = getStatsSync(srcItem, destItem, ctx)

        onCopySyncBegin(srcItem, destItem, srcStat, destStat, ctx)
    })
}

function onCopySyncBegin(src: string, dest: string, srcStat: StatsExtra, destStat: StatsExtra | undefined, ctx: IContext) {
    if (ctx.filter(src, dest)) {
        return
    }

    if (srcStat.isDirectory()) {
        return copyDirSync(src, dest, srcStat, destStat, ctx)
    }

    if (isFile(srcStat)) {
        return cpFileSync(src, dest, srcStat, destStat, ctx.overwrite)
    }

    if (srcStat.isSymbolicLink()) {
        return copyLinkSync(src, dest, ctx.dereference, destStat)
    }
}

export function copyFileSync(src: string, dest: string, opts: { dereference?: boolean; overwrite?: boolean } = {}) {
    try {
        const { srcStat, destStat } = getStatsSync(src, dest, opts)
        
        cpFileSync(src, dest, srcStat, destStat, opts.overwrite)
    } catch (err) {
        throw err
    }
}

export function copyLinkSync(src: string, dest: string, dereference?: boolean, destStat?: Stats | BigIntStats) {
    let resolvedSrc = fs.readlinkSync(src)

    if (dereference) {
        resolvedSrc = path.resolve(process.cwd(), resolvedSrc)
    }

    if (!destStat) {
        return fs.symlinkSync(resolvedSrc, dest)
    }
    let resolvedDest!: string

    try {
        resolvedDest = fs.readlinkSync(dest)
    } catch (err) {
        if (err.code === 'EINVAL' || err.code === 'UNKNOWN') {
            return fs.symlinkSync(resolvedSrc, dest)
        }
        throw err
    }

    if (dereference) {
        resolvedDest = path.resolve(process.cwd(), resolvedDest)
    }

    if (isSubdir(resolvedSrc, resolvedDest)) {
        throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`)
    }

    if (destStat.isDirectory() && isSubdir(resolvedDest, resolvedSrc)) {
        throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`)
    }

    fs.unlinkSync(dest)
    fs.symlinkSync(resolvedSrc, dest)
}

export function copySync(src: string, dest: string, opts?: IOptions) {
    let dereference = true
    let overwrite = true
    let filter: IFilter = never
    let mode: Mode | undefined = undefined
    let bigint = undefined

    if (typeof opts === 'object' && opts) {
        mode = opts.mode
        dereference = !!opts.dereference
        overwrite = 'overwrite' in opts ? !!opts.overwrite : true
        filter = typeof opts.filter === 'function' ? opts.filter : never
        bigint = 'bigint' in opts ? !!opts.bigint : undefined
    } else if (typeof opts === 'function') {
        filter = opts as IFilter
    }

    const ctx = {
        dereference,
        overwrite,
        filter,
        mode,
        bigint
    }

    try {
        const { srcStat, destStat } = getStatsSync(src, dest, ctx)

        if (destStat && destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
            throw new Error('Source and destination must not be the same.')
        }

        if (srcStat.isDirectory() && isSubdir(src, dest)) {
            throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`)
        }

        checkParentStatSync(srcStat, src, dest, ctx)
        onCopySyncBegin(src, dest, srcStat, destStat, ctx)
    } catch (err) {
        throw err
    }
}
