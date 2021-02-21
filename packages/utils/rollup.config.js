// @ts-nocheck
import fs from 'fs'
import path from 'path'
import {
  generateRollupConfig
} from '@tlg/builder'
import {
  NODE_APP_ENVIRONMENT
} from '@tlg/util'

const srcDir = path.resolve(__dirname, './src')
const files = fs.readdirSync(srcDir)
const configs = []
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
    const isBrowserBuilds = onlyBrowserModules.includes(name)
    const config = generateRollupConfig({
      entry: `./src/${name}/index.ts`,
      output: {
        format: isBrowserBuilds ? 'es' : 'cjs',
        file: `./dist/${name}.js`,
        name: isBrowserBuilds ? `${name}Util` : name
      },
      root: __dirname,
      isNodeBuilds: false,
      isBrowserBuilds,
      minify: NODE_APP_ENVIRONMENT.isProd, // NODE_APP_ENVIRONMENT.isProd,
      tsCompilerOptions: {
        target: "ES5",
        module: "ESNext"
      },
      tsDisabled: false
    })

    configs.push(config)
  }
})

export default configs
