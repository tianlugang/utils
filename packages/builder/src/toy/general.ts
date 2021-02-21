import { existsSync } from 'fs'
import path from 'path'
import { logger, getSRCByCwd } from '@tlg/util'
import { resolveProj } from '../projrc'
import generator from './generator'

type IGenerateOptions = Parameters<typeof generator.write>[0]
type ITsVue2Options = {
    isComponent: boolean
    isModule: boolean
    isPage: boolean
};

function resolveTsVue2(...args: string[]) {
    return path.resolve(__dirname, '../../template/ts-vue2', ...args)
}

export function tsAndVUE2(name: string, option: ITsVue2Options) {
    const { isComponent, isModule, isPage } = option
    const kind = isComponent ? 'component' : isModule ? 'module' : isPage ? 'page' : undefined
    const opts: IGenerateOptions = { name, src: '', dest: '' }

    if (kind) {
        const { template: { dir, srcDir, onlyCWD, data } } = resolveProj()

        opts.src = existsSync(dir) ? dir : resolveTsVue2(kind)
        opts.dest = existsSync(srcDir) ? srcDir : getSRCByCwd(onlyCWD)
        opts.data = data

        if (!opts.dest) {
            return generator.write(opts)
        }
        logger.println('dest directory is undefined')
    }
}

export function general(name: string, option: { template?: string, src?: string }) {
    const { template: { dir, srcDir, onlyCWD, data } } = resolveProj()
    const opts: IGenerateOptions = {
        name,
        src: option.template ? option.template : dir,
        dest: option.src ? option.src : srcDir,
        data
    }

    if (!existsSync(opts.src)) {
        return logger.println('can not find template.')
    }

    opts.dest = existsSync(opts.dest) ? opts.dest : getSRCByCwd(onlyCWD)

    if (!opts.dest) {
        return logger.println('dest directory is undefined')
    }

    return generator.write(opts)
}
