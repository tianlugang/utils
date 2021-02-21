import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import ora from 'ora'
import validator from 'validator'
import symbols from 'log-symbols'
import downloadURL from 'download'
import rimraf from 'rimraf'
import { logger, copySync, directoryExists, fileExists, colorize } from '@tlg/util'
import { hasOwnProperty } from '@tlg/utils/lib/base'
import { isObject } from '@tlg/utils/lib/type/is-object'
import { resolveProj } from '../projrc'
import { configProvider, configInit } from './config'
import git from './git'
import template from './template'

interface IProjectRenderData {
  name: string
  noNodeJS: boolean
  noNpmScope: boolean
  repoHost?: string
  npmScope?: string
  username?: string
  email?: string
  blog?: string
  [k: string]: string | boolean | number | undefined
};

export interface IProjectInitOptions {
  repoHost: string
  noNpmScope: boolean
  noNodeJS: boolean
  url: string
  template: string
  npmScope: string
};

const baseDownloadOptions = {
  extract: true,
  strip: 1,
  mode: '666',
  headers: {
    accept: 'application/zip'
  },
}

const project = {
  clone(url: string, dest: string, opts?: Parameters<typeof git.clone>[2]) {
    return new Promise<unknown>((resolve, reject) => {
      git.clone(url, dest, opts, err => {
        if (err) {
          if (git.isEasyError(err)) {
            return downloadURL(url, dest, baseDownloadOptions).then(resolve).catch(reject)
          }

          return reject(err)
        }

        resolve(null)
      })
    })
  },

  download(url: string, dest: string, opts: { headers?: Record<string, string>;[k: string]: any } = {}) {
    const { headers, ...rest } = opts
    const options = Object.assign({}, baseDownloadOptions, rest)

    Object.assign(options.headers, opts.headers)

    logger.debug({ url, dest }, 'Download Project form `@{url}` to `@{dest}`.')

    return downloadURL(url, dest, options)
  },

  copyLocal(src: string, dest: string) {
    logger.info(null, `Copy Project from local boilerplate. It is in (${src}).`);
    return new Promise<void>((resolve, reject) => {
      const ingore = /(node_modules)/
      const filter = (name: string) => ingore.test(name)

      try {
        copySync(src, dest, { filter, bigint: false })
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  fixName(name: string, noNodeJS: boolean, noNpmScope: boolean, npmScope?: string) {
    name = name.replace(/@/g, '').replace(/(\/|\\)/g, '-').trim()

    if (noNodeJS) {
      return name
    }
    const validInfo = require('is-valid-npm-name')(name)
    const isInvalid = validInfo !== true

    if (isInvalid) {
      logger.fatal(null, validInfo)
      return
    }
    npmScope = npmScope || configProvider.npmScope

    if (noNpmScope || name.startsWith('@') || !npmScope) {
      return name
    }

    return `@${npmScope.replace(/@/g, '')}/${name}`
  },

  init(id: string, opts: IProjectInitOptions) {
    configInit(() => {
      const name = project.fixName(id, opts.noNodeJS, opts.noNpmScope, opts.npmScope)
      if (!name) {
        return
      }
      const dest = `${configProvider.workspace || process.cwd()}/${name}`

      if (directoryExists(dest)) {
        logger.warn({ dest }, 'project already existed, whereIs: @{dest}')
        return
      }

      const loc = hasOwnProperty(opts, 'template') ? (template.get(opts.template) || opts.template) : name
      const spin = ora('Project creating... ');

      spin.start();
      (directoryExists(loc) ?
        project.copyLocal(loc, dest) : validator.isURL(loc) ?
          project.download(loc, dest) : project.clone(loc, dest)
      ).then(() => {
        project.render(dest, {
          ...(configProvider.data || {}),
          name,
          noNodeJS: opts.noNodeJS,
          noNpmScope: opts.noNpmScope,
          repoHost: opts.repoHost || configProvider.repoHost,
          npmScope: configProvider.npmScope,
          username: configProvider.username,
          email: configProvider.email,
          blog: configProvider.blog,
        })
        spin.succeed()
        logger.output(symbols.success, colorize.green('Project Created.'))
        rimraf.sync(dest + '/.git')
      }).catch((err: NodeJS.ErrnoException) => {
        spin.fail()
        logger.output(symbols.error, colorize.red(err.message))
      })
    })
  },

  render(dest: string, data: IProjectRenderData) {
    const { boilerplates } = resolveProj(dest)
    for (const template of boilerplates) {
      if (!isObject(template) || !hasOwnProperty(template, 'path') || typeof template.path !== 'string') {
        continue
      }

      const templatePath = path.join(dest, template.path)

      if (fileExists(templatePath)) {
        const compileOption = {}
        const templateData = typeof template.render === 'function'
          ? template.render(data, compileOption) : Object.assign({}, data, template.render)
        const templateContent = fs.readFileSync(templatePath, 'utf8').toString()
        const renderedContent = ejs.render(templateContent, templateData, compileOption)

        fs.writeFileSync(templatePath, renderedContent)
      }
    }
  }
}

export default project
