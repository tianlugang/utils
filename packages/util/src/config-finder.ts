import fs from 'fs'
import path from 'path'
import { returnString } from '@tlg/utils'
import { fileExists, folderExists } from './fs-utils'
import { mkdirp } from './mkdirp'

const TLG_DIR = '.tlg'
const XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME
const XDG_DATA_HOME = process.env.XDG_DATA_HOME
const HOME = process.env.HOME
const APPDATA = process.env.APPDATA
const CWD = process.cwd()
const isAbsolutePathLike = (p: string | TemplateStringsArray) => {
  return typeof p === 'string' && path.isAbsolute(p)
}
const scanDirs = (customPath?: string): IConfigObject[] => {
  const tryPaths: IConfigObject[] = []

  if (customPath && folderExists(customPath)) {
    tryPaths.push({
      dir: path.resolve(customPath, TLG_DIR),
      type: 'cus',
    })

    return tryPaths
  }

  const xdgConfig = XDG_CONFIG_HOME || HOME && path.join(HOME, TLG_DIR)

  if (xdgConfig && folderExists(xdgConfig)) {
    tryPaths.push({
      dir: path.join(xdgConfig, TLG_DIR),
      type: 'xdg',
    })
  }

  if (process.platform === 'win32' && APPDATA && folderExists(APPDATA)) {
    tryPaths.push({
      dir: path.resolve(path.join(APPDATA, TLG_DIR)),
      type: 'win',
    })
  }

  tryPaths.push({
    dir: path.resolve(CWD, TLG_DIR),
    type: 'def',
  })

  return tryPaths
}

export interface IConfigObject {
  dir: string
  type: 'win' | 'xdg' | 'def' | 'cus'
}

export interface IGeneateOptions extends IConfigObject {
  scope: string
  name: string
  template: string 
  xdgDataDir?: string
  xdgConfigHandle?(dataDir: string, content: string): string
}

export interface IForceOptions extends IConfigObject {
  scope: string
  name: string
  content: string
}

export const configFinder = {
  scan(customPath?: string) {
    const paths = scanDirs(customPath)

    for (let i = 0; i < paths.length; i++) {
      if (folderExists(paths[i].dir)) {
        return paths[i]
      }
    }

    return paths[0]
  },

  force(options: IForceOptions) {
    const { scope, name, dir, content } = Object.assign({
      scope: 'npm',
      name: 'config.yaml'
    }, options)
    const configPath = path.join(dir, scope, name)

    fs.writeFileSync(configPath, content)
    return configPath
  },

  generate(options: IGeneateOptions): string {
    const {
      scope, name,
      xdgDataDir,
      xdgConfigHandle,
      dir, type, template
    } = Object.assign({
      scope: 'npm',
      name: 'config.yaml',
      xdgDataDir: 'storage',
      xdgConfigHandle: returnString,
    }, options)
    const scopeDir = path.join(dir, scope)
    const configPath = path.join(scopeDir, name)

    if (fileExists(configPath)) {
      return fs.readFileSync(configPath, 'utf8')
    }

    mkdirp.sync(dir)
    mkdirp.sync(scopeDir)

    let content = isAbsolutePathLike (template) ? fs.readFileSync(template.toString(), 'utf8') : template

    if (type === 'xdg') {
      let dataDir = XDG_DATA_HOME || HOME && path.join(HOME, '.local/share')

      if (dataDir && folderExists(dataDir)) {
        dataDir = path.resolve(dataDir, `${TLG_DIR}/${scope}/${xdgDataDir}`)
        content = xdgConfigHandle(content, dataDir)
      }
    }

    fs.writeFileSync(configPath, content)

    return content
  }
}

