// @ts-nocheck
import fs from 'fs'
import path from 'path'

const {
  NODE_APP_ENVIRONMENT
} = require('@tlg/utils')
const {
  generateRollupConfig
} = require('@tlg/builder')
const srcDir = path.resolve(__dirname, './src')
const files = fs.readdirSync(srcDir)
const configs = []
const onlyNodeModules = [
  'node'
]
const onlyBrowserModules = [
  'bom',
  'dom',
  'request',
  'storage',
  'spin'
]

function isDirectory(r, p) {
  p = path.join(r, p)

  try {
    if (fs.statSync(p).isDirectory()) return p
  } catch (error) {}

  return
}

files.forEach(file => {
  if (isDirectory(srcDir, file)) {
    const name = path.basename(file)
    const isNodeBuilds = onlyNodeModules.includes(name)
    const isBrowserBuilds = onlyBrowserModules.includes(name)
    const config = generateRollupConfig({
      entry: `./src/${name}/index.ts`,
      output: {
        format: isBrowserBuilds ? 'es' : 'cjs',
        file: `./dist/${name}.js`,
        name: isNodeBuilds ? name : `${name}Util`
      },
      root: __dirname,
      isNodeBuilds,
      isBrowserBuilds,
      minify: isNodeBuilds ? false : NODE_APP_ENVIRONMENT.isProd,
      tsCompilerOptions: isNodeBuilds ? {
        target: 'ES5',
        module: 'ESNext'
      } : {
        target: "ES6"
      }
    })

    configs.push(config)
  }
})

export default configs
