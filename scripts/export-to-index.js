const fs = require('fs')
const path = require('path')
const args = process.argv.slice(2)
const rimraf = require('rimraf')

if (args.length === 0) {
  console.log('No args.')
  process.exit()
}
console.log('args eg: // args = [ package-name, dir1, dir2, dir3 ... dirN ]')

const errors = []
const srcDir = path.resolve(__dirname, '../src')
const total = fs.readdirSync(srcDir).filter(filterDirectory)
const names = args.includes('*') ? total : args

names.forEach(name => {
  const dir = name.trim()
  if (dir.length === 0) {
    return
  }

  const parsedName = path.parse(name)
  if (parsedName.name === 'main' || parsedName.name === 'index' || !!parsedName.ext) {
    return
  }

  exportIndex(dir)
})

errors.forEach(console.error)

function exportIndex(dir) {
  const destDir = path.resolve(srcDir, dir)
  try {
    const stat = fs.statSync(destDir)
    if (stat.isDirectory()) {
      const typeIndex = path.resolve(destDir, 'index.ts')
      const typeFiles = []

      fs.readdirSync(destDir).forEach(fileBase => {
        const {
          name,
          ext
        } = path.parse(fileBase)

        if (name === '.git' || name === '.tmp') {
          rimraf.sync(path.join(destDir, fileBase))
        }
        if (name === 'index' || ext !== '.ts') return

        typeFiles.push(`export * from './${name}'`)
      })

      fs.writeFileSync(typeIndex, typeFiles.join('\n'))
    }
  } catch (error) {
    errors.push(error)
  }
}

function filterDirectory(file) {
  const filePath = path.resolve(srcDir, file)
  const stat = fs.statSync(filePath)

  return stat.isDirectory()
}
