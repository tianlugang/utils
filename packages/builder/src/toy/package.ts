import fs from 'fs'
import path from 'path'
import { hasOwnProperty } from '@tlg/utils'
import { logger } from '@tlg/util'
import { configProvider } from '../soldier/config'

const fixPackageName = (name: string) => {
  const nameValidMsg = require('is-valid-npm-name')(name)
  if (nameValidMsg !== true) {
    throw new Error(nameValidMsg)
  }

  const names = name.split('/')
  const valid = names[names.length > 1 ? 1 : 0]

  if (configProvider.npmScope) {
    return `@${configProvider.npmScope}/${valid}`
  }

  return valid
}
type JSONObject = {
  [k: string]: string | boolean | number
}
type UpdateOptions = {
  assets: JSONObject
  root: string
  name: string
  fields: string[]
  license: string | boolean
  licenses?: string
  nameIsDirName?: boolean
  isNPMScoped?: boolean
}

const formatPackage = (opts: UpdateOptions) => {
  const stat = tryCatch(fs.statSync, opts.root)

  if (stat.isDirectory()) {
    const licensePath = path.resolve(opts.root, 'LICENSE')
    const pkgJsonPath = path.resolve(opts.root, 'package.json')
    const pkgJson = tryCatch(require, pkgJsonPath)

    opts.fields.forEach(field => {
      if (hasOwnProperty(pkgJson, field)) {
        pkgJson[field] = opts.assets[field]
      }
    })

    pkgJson.author = {
      name: configProvider.username,
      email: configProvider.email,
      url: configProvider.blog
    }
    pkgJson.license = typeof opts.license === 'string' ? opts.license : pkgJson.license || 'MIT'
    pkgJson.name = opts.nameIsDirName ?
      name : opts.isNPMScoped ?
        fixPackageName(pkgJson.name) : pkgJson.name

    tryCatch(fs.writeFileSync, pkgJsonPath, JSON.stringify(pkgJson, null, 4))
    if (typeof opts.licenses === 'string') {
      tryCatch(fs.writeFileSync, licensePath, opts.licenses)
    }
  }
}

interface Fn<R> {
  (...args: any[]): R
}

const tryCatch = <R>(fn: Fn<R>, ...args: Parameters<typeof fn>) => {
  try {
    return fn.apply(null, args)
  } catch (err) {
    throw err
  }
}

const getOpts = <O = any>(opts: O, key: keyof O, def: O[keyof O]) => {
  if (key in opts) {
    return opts[key] || def
  }

  return def
}

const getPackagesPath = (p: string, r: string) => {
  if (p === '.') {
    return path.join(r, 'packages')
  }

  if (typeof p === 'string') {
    if (p === '/' || p.trim().length === 0) {
      return
    }

    return path.isAbsolute(p) ? p : path.resolve(r, p)
  }

  return
}

type SyncInfoOptions = {
  licensePath: string
  license: string
  packages: string
  packagePath: string
  nameIsDirName: boolean
  isNPMScoped: boolean
  root: string
  package: string
}

export const syncPackageInfo = (opts: SyncInfoOptions) => {
  const CWD = process.cwd()
  const root = path.isAbsolute(opts.root) ? opts.root : CWD
  const fields = ['homepage', 'repository', 'bugs']
  const license = getOpts(opts, 'license', false)
  const licensePath = getOpts(opts, 'licensePath', path.resolve(root, './LICENSE')) as string
  const pkgPath = getOpts(opts, 'packagePath', path.resolve(root, './package.json')) as string
  const nameIsDirName = getOpts(opts, 'nameIsDirName', false) as boolean
  const isNPMScoped = getOpts(opts, 'isNPMScoped', false) as boolean
  const packagePath = getOpts(opts, 'package', '') as string

  try {
    const assets = tryCatch(require, pkgPath)
    const licenses = tryCatch<string>(fs.readFileSync, licensePath, 'utf8')
    let onlyOnePackage = false

    if (!!packagePath) {
      if (!tryCatch(fs.statSync, packagePath).isDirectory()) {
        throw new Error('Package is not a Directory.')
      }

      onlyOnePackage = true
      formatPackage({
        name: path.basename(packagePath),
        root: packagePath,
        license,
        licenses,
        assets,
        fields,
        nameIsDirName,
        isNPMScoped
      })
    }

    const packagesPath = onlyOnePackage ? undefined : getPackagesPath(opts.packages || '.', root)

    if (packagesPath) {
      tryCatch<string[]>(fs.readdirSync, packagesPath, 'utf8')
        .forEach(name => formatPackage({
          name,
          root: path.resolve(path.dirname(packagesPath), name),
          license,
          licenses,
          assets,
          fields,
          nameIsDirName,
          isNPMScoped
        }))
    }
  } catch (error) {
    logger.error(null, error.message)
  }
}
