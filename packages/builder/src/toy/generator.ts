
import fs from 'fs'
import path from 'path'
import assert from 'assert'
import { IProjectTemplate } from '../projrc'

type IJsonData = IProjectTemplate['data']
type IRender = IProjectTemplate['render']
type IGenerateOptions = {
  name: string
  data?: IJsonData
  dest: string
  render?: IRender
  src: string
}
type ICreateOptions = {
  data: IJsonData
  dest: string
  onError(err: NodeJS.ErrnoException | null): void
  render: IRender
  src: string
}

function toUpperFirstCase(str: string) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function defaultRender(content: string, data: IJsonData) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      content = content.replace(new RegExp(`_${key}_`, 'g'), data[key].toString())
    }
  }

  return content
}

function create({ src, dest, data, onError, render }: ICreateOptions) {
  fs.stat(src, (err, stat) => {
    if (err) {
      return onError(err)
    }

    if (stat.isFile()) {
      return fs.readFile(src, 'utf8', (err, content) => {
        if (err) {
          return onError(err)
        }

        const rendered = render(content, data)
        fs.writeFile(dest, rendered, onError)
      })
    }

    if (stat.isDirectory()) {
      return fs.readdir(src, 'utf8', (err, files) => {
        if (err) {
          return onError(err)
        }

        fs.mkdir(dest, () => {
          for (const file of files) {
            create({
              src: path.join(src, file),
              dest: path.join(dest, file),
              data,
              onError,
              render
            })
          }
        })
      })
    }
  })
}

function write({ src, dest, name, data, render }: IGenerateOptions) {
  assert.ok(path.isAbsolute(src), 'template path must be absolutely.')
  if (!dest || !fs.existsSync(dest) || !path.isAbsolute(dest)) {
    dest = process.cwd()
  }

  create({
    src,
    dest: dest + path.extname(src),
    data: Object.assign({
      name,
      capitalized: toUpperFirstCase(name)
    }, data),
    onError: err => {
      if (err) {
        throw err
      }
    },
    render: render || defaultRender
  })
}

export default {
  write
}