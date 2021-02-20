
import chalk from 'chalk'
import inquirer from 'inquirer'
import { logger } from '@tlg/utils/lib/node'
import { configProvider, configMixed } from './config'

const util = {
  has(name: string) {
    return util.of().hasOwnProperty(name)
  },

  get(name: string) {
    if (typeof name !== 'string') return
    name = name.trim()

    if (!name) return

    return util.of()[name]
  },

  of() {
    if (!configProvider.template) {
      configProvider.template = {}
      configMixed(configProvider)
    }

    return configProvider.template
  },

  set(name: string, value: string) {
    const template = util.of()
    
    template[name] = value
    configMixed(configProvider)
  },
  
  delete(name: string) {
    delete util.of()[name]
    configMixed(configProvider)
  }
}

const template = {
  ls(name: string) {
    const already = util.of()
 
    if (!name) {
      logger.output(chalk.green('Current Template Dirs:'))
      logger.object(already, '\n', '')

      return
    }

    if (!util.has(name)) {
      logger.fatal({
        name,
        types: Object.keys(already).join(', ')
      }, 'See template detail, Can not find type `@{name}`, optional: @{types}')
      return
    }

    logger.message({
      name: chalk.green(name)
    }, `template name: @{name}`)

    logger.message({
      path: chalk.green(already[name])
    }, `template link: @{path}`)
  },

  async add(name: string, link: string) {
    if (!name) {
      return logger.error(null, 'Missing name, please via it.')
    }

    if (util.has(name)) {
      const replaced = await inquirer.prompt([{
        type: 'confirm',
        default: false,
        message: 'Already exists, do you want to replace it',
        name: 'replaced'
      }]).then((answer: { replaced: boolean; }) => answer.replaced)

      if (!replaced) {
        return
      }
    }

    util.set(name, link)
    logger.message(null, 'Template Added.')
  },

  rm(name: string) {
    if (util.has(name)) {
      util.delete(name)
      return logger.message(null, 'Template Removed.')
    }

    logger.warn({ name }, 'Cannot find the template: @{name}')
  },

  get: util.get
}

export default template
