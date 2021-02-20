import fs from 'fs'
import path from 'path'

function isJsFile(filePath: string) {
  const extname = path.extname(filePath)

  return /(js|json|es|esm|ts)$/i.test(extname)
}

function hasOwnStringProp(current: any, key: any) {
  return typeof key === 'string' && Object.prototype.hasOwnProperty.call(current, key)
}

function isValidObject(obj: any) {
  return obj && typeof obj === 'object' && !Array.isArray(obj)
}

function mergeProxy(result: any, current: any) {
  if (Array.isArray(current)) {
    current.forEach(item => mergeProxy(result, item))
  } else if (typeof current === 'function') {
    const currentResult = current(result)

    mergeProxy(result, currentResult)
  } else if (typeof current === 'object') {
    for (let key in current) {
      if (hasOwnStringProp(current, key) && isValidObject(current[key])) {
        result[key] = current[key]
      }
    }
  }
}

export function loadProxy(rootDir: string) {
  if (!path.isAbsolute(rootDir)) {
    throw new Error('Proxy-Directory must be an absolute path.')
  }

  const results = {}
  const proxies = fs.readdirSync(rootDir)

  proxies.forEach(fileBase => {
    const filePath = path.resolve(rootDir, fileBase)
    const fileStat = fs.statSync(filePath)

    if (fileStat.isFile() && isJsFile(filePath)) {
      mergeProxy(results, require(filePath))
    }
  })

  return results
}
