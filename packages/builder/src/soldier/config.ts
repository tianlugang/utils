import path from 'path'
import inquirer from 'inquirer'
import validator from 'validator'
import { logger, Yaml, configFinder, mkdirp,colorize, directoryExists } from '@tlg/util'
import { extend } from '@tlg/utils/lib/object/extend'
import { isEmptyObject } from '@tlg/utils/lib/type/is-empty-object'

const CONFIG_YAML_EXAMPLE = `
# 日志等级
logLevel: 0

# 使用的git仓库服务器地址
repoHost: https://github.com/

# 用户名
username: ''

# 用户的邮箱
email: ''

# 用户的博客地址
blog: ''

# npm包的作用域名
npmScope: 'tlg'

# 工作目录
workspace: '.'

# 项目模板
template:
  vue-tsx: git@192.168.50.14:tianlugang/vue-ts.git
`
const createWorkspace = (dirName: string) => {
  if (typeof dirName !== 'string') {
    logger.error(null, 'Workspace directory must be a string.')
    return
  }

  dirName = dirName.trim()

  const CWD = process.cwd()

  if (dirName === '' || dirName === '.') {
    logger.warn({ dir: colorize.green(CWD) }, 'Workspace is current directory. It is in \'@dir\'')
    return
  }

  if (directoryExists(dirName)) {
    logger.info(null, `Workspace Directory: ${dirName}`)
    return
  }

  dirName = path.isAbsolute(dirName) ? dirName : path.resolve(CWD, dirName)

  if (directoryExists(dirName)) {
    return
  }

  mkdirp.sync(dirName)
  logger.info({ dir: colorize.green(dirName) }, `Workspace created. It is in '@dir'`)
}

const isValidUsername = (value: any) => !!value && /^[a-zA-Z_]{1}[a-zA-Z0-9_]{5,20}/.test(value)
const isValidNpmScope = (value: any) => !!value && /^[a-zA-Z_]{1}[a-zA-Z0-9_]{2,20}/.test(value)
const isValidLogLevel = (value: any) => logger.levels.includes(value)

const username = {
  type: 'input',
  name: 'username',
  message: 'Please enter your name, can not start with number. Mark that you are the owner of the current package.',
  validate: isValidUsername
}

const email = {
  type: 'input',
  name: 'email',
  message: 'Please enter your email address',
  validate: validator.isEmail
}

const blog = {
  type: 'input',
  name: 'blog',
  message: 'Please enter your blog URL',
  validate: validator.isURL
}

const logLevel = {
  type: 'list',
  name: 'logLevel',
  message: 'Set logger level',
  choices: logger.levels
}

const npmScope = {
  type: 'input',
  name: 'npmScope',
  message: 'Set Your NPM package scope, can not start with number.',
  choices: logger.levels,
  validate: isValidNpmScope
}

export type IConfig = {
  // 日志等级
  logLevel: string
  // 使用的git仓库服务器地址
  repoHost: string
  // 用户名
  username: string
  // 用户的邮箱
  email: string
  // 用户的博客地址
  blog: string
  // npm包的作用域名
  npmScope: string
  // 工作目录
  workspace: string
  // 项目模板
  template: Record<string, string>
  // 自定义数据
  data: Record<string, any>
}

export const configLoader = (variables?: Partial<IConfig>) => {
  const name = 'config.yaml'
  const scope = 'proj'
  const info = configFinder.scan()
  const content = configFinder.generate({
    ...info,
    name,
    scope,
    template: CONFIG_YAML_EXAMPLE
  })
  const configJson = Yaml.toJson(content)

  if (!variables) {
    return configJson as IConfig
  }

  const configJsonMerged = extend(configJson, true, variables)
  const configYaml = Yaml.toYaml(configJsonMerged)
  const configPath = configFinder.force({
    ...info,
    name,
    scope,
    content: configYaml
  })

  createWorkspace(configJsonMerged.workspace)
  logger.info(null, `Update config successful, it is in: '${colorize.green(configPath)}'.`)
  return configJsonMerged as IConfig
}

export const configProvider: Partial<IConfig> = {}

export const configMixed = (variables?: any) => {
  const configJson = configLoader(variables)

  extend(configProvider, true, configJson)
}

export const configMerged = (configProvider: object) => {
  const configJson = configLoader()

  extend(configProvider, true, configJson)
}

export const configInit = (callback: () => void) => {
  const configJson = configLoader()
  const prompts = []

  extend(configProvider, true, configJson)

  if (!isValidUsername(configProvider.username)) {
    prompts.push(username)
  }

  if (!validator.isEmail(configProvider.email || '')) {
    prompts.push(email)
  }

  if (configProvider.blog && !validator.isURL(configProvider.blog)) {
    prompts.push(blog)
  }

  if (!isValidLogLevel(configProvider.logLevel)) {
    prompts.push(logLevel)
  }

  if (!isValidNpmScope(configProvider.npmScope)) {
    prompts.push(npmScope)
  }

  if (prompts.length === 0) {
    return callback()
  }

  inquirer.prompt(prompts).then((answers: object) => {
    console.log(answers)

    if (!isEmptyObject(answers)) {
    }
    configMixed(answers)
    callback()
  }).catch(logger.output)
}