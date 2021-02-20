type ICookieValue = string | number | boolean
type ICookieJson = Record<string, ICookieValue>
interface IOptions {
  expires: number | string
  path: string
  [key: string]: ICookieValue
}

const getKey = (key: string) => encodeURIComponent(key).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape)
const getValue = (value: string) => encodeURIComponent(value).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent)
const getExpires = (expires: number) => {
  var date = new Date(new Date().getTime() + expires * 864e+5)

  return date ? date.toUTCString() : '';
}
const decode = (s: string) => s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
const getCookie = (key?: string, toJson: boolean = false) => {
  const jar: ICookieJson = {}
  const cookies = document.cookie ? document.cookie.split('; ') : []

  for (let i = 0, name; i < cookies.length; i++) {
    let parts = cookies[i].split('=')
    let cookie = parts.slice(1).join('=')

    if (!toJson && cookie.charAt(0) === '"') {
      cookie = cookie.slice(1, -1)
    }

    try {
      name = decode(parts[0])
      cookie = decode(cookie)

      if (toJson) {
        try {
          cookie = JSON.parse(cookie)
        } catch (e) { }
      }

      jar[name] = cookie

      if (key === name) {
        break
      }
    } catch (e) {
      e.name = '[CookieError]'
      throw e
    }
  }

  return key ? jar[key] : jar
}
const setCookie = (key: string, value: string, options: Partial<IOptions>) => {
  const opts = Object.assign({
    path: '/'
  }, options)

  // IE不支持 "max-age"，所以使用 expires
  if ('number' === typeof opts.expires) {
    opts.expires = getExpires(opts.expires)
  }

  try {
    let result = JSON.stringify(value)
    if (/^[\{\[]/.test(result)) {
      value = result
    }
  } catch (e) { }

  value = getValue(value)
  key = getKey(key)

  let setting = ''
  for (let name in opts) {
    const sValue = opts[name]
    if (!sValue) {
      continue
    }
    setting += ';' + name;
    if (sValue === true) {
      continue
    }

    setting += '=' + sValue.toString().split('; ')[0]
  }

  return (document.cookie = key + '=' + value + setting)
}

export namespace Cookie {
  // 存储
  export function set(key: string, value: string, options: IOptions) {
    return setCookie(key, value, options)
  }

  // 读取
  export function get(key: string) {
    return getCookie(key)
  }

  // 删除
  export function remove(key: string) {
    setCookie(key, '', {
      expires: -1
    })
  }

  // 清空
  export function clear() {
    const date = new Date()
    date.setTime(date.getTime() - 10000)

    const keys = document.cookie.match(/[^ =;]+(?=\=)/g)
    if (keys) {
      for (var i = keys.length; i--;) {
        document.cookie = keys[i] + "=0; expire=" + date.toUTCString() + "; path=/"
      }
    }
  }

  // 是否含有
  export function has(key: string) {
    return !!Cookie.get(key)
  }

  // 转换为JSON
  export function toJSON(key?: string) {
    return getCookie(key, true)
  }
}
