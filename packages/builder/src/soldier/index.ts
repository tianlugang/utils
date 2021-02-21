import { logger } from '@tlg/util'
import { hasOwnProperty } from '@tlg/utils'
import { configMixed,configMerged, configLoader, configProvider } from './config'
import project from './project'
import template from './template'

export const soldierConfigMerged = configMerged
export const soldier = {
  config(option: { [k: string]: string | boolean | undefined; all?: string | boolean }) {
    configMixed()

    if (option.all === true) {
      const configJson = configLoader()
      logger.output(configJson)
      return
    }

    if (typeof option.all === 'string') {
      if (hasOwnProperty(configProvider, option.all)) {
        logger.message(configProvider, `See config detail, parameter\'s value is @{${option.all}}`)
      } else {
        logger.fatal({
          key: option.all
        }, 'See config detail, Invalid config option @{key}')
      }
      return
    }

    const closedKeys = ['template']
    const configKeys = Object.keys(configProvider)
    const updateVars: any = {}
    let counter = 0

    configKeys.forEach(field => {
      if (hasOwnProperty(option, field) && !closedKeys.includes(field)) {
        counter++
        updateVars[field] = option[field]
      }
    })

    if (counter > 0) {
      configMixed(updateVars)
    }
  },
  init(name: string, opts: Parameters<typeof project.init>[1]) {
    project.init(name, opts)
  },
  template(name: string, option: { link: string; }) {
    configMixed()
    if (option.link) {
      return template.add(name, option.link)
    }

    if (option.link) {
      return template.rm(option.link)
    }
    
    template.ls(name)
  }
}