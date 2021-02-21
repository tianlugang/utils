// @ts-nocheck
import fs from 'fs'
import path from 'path'
import {
  generateRollupConfig
} from '@tlg/builder'
import {
  NODE_APP_ENVIRONMENT,
  directoryExists
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
const createConfig = file => {
  const absFilePath = path.resolve(srcDir, file)
  if (directoryExists(absFilePath)) {
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
      tsCompilerOptions: isBrowserBuilds ? {
        target: "ES5",
        module: "ESNext"
      } : {
        module: "ESNext"
      },
      tsDisabled: false
    })

    configs.push(config)
  }
}

files.forEach(createConfig)

export default configs
