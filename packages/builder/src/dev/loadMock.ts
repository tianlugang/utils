import fs from 'fs'
import path from 'path'

const isClass = (fn: any) => {
  return typeof fn === 'function' && fn.toString().startsWith('class')
}

export class MockController<R, S> {
  router!: R
  server!: S
  constructor(router: R, server: S) {
    this.router = router
    this.server = server
  }

  getPropsFromRequestBody<B = any>(body: B, propName: keyof B) {
    if (body && Object.prototype.hasOwnProperty.call(body, propName)) return body[propName]
    return
  }
}

export function loadMock(rootDir: string) {
  if (!path.isAbsolute(rootDir)) {
    throw new Error('Mock-Actions-Root-Directory must be an absolute path.')
  }
  const files = fs.readdirSync(rootDir)

  return function handleDevServerBefore<R = any, S = any>(app: R, server: S) {
    if (files.length) {
      console.log()
      console.log('[DevTool:Mock] Now, start install `mock-app`.')
    }

    files.forEach(file => {
      const filePath = path.resolve(rootDir, file)
      const action = require(filePath)

      if (isClass(action)) {
        return new action(app, server)
      }

      if (typeof action === 'function') {
        return action.call(new MockController(app, server))
      }

      throw new Error('Invalid Mock Action')
    })
  }
}