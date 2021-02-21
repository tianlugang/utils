import util from 'util'

type IConfig = {
  logLevel: ILevel
  logTitle: string
}
type ILevel = keyof typeof levels
type ISubsystemsObject = {
  in: string
  out: string
  fs: string
  default: string
}
type IRecordOfKeyNS = Record<string | number, any> & {
  sub?: keyof ISubsystemsObject
} | null

const times = new Map<string, number>()

const configProvider: IConfig = {
  logLevel: 'info',
  logTitle: 'LOG'
}

const subsystems: ISubsystemsObject[] = [
  // 
  {
    in: '\u001b[32m<--\u001b[39m',
    out: '\u001b[33m-->\u001b[39m',
    fs: '\u001b[90m-=-\u001b[39m',
    default: '\u001b[34m---\u001b[39m',
  },
  {
    in: '<--',
    out: '-->',
    fs: '-=-',
    default: '---',
  }
]

const levels = {
  fatal: 29,
  error: 31,
  warn: 33,
  message: 35,
  info: 36,
  debug: 90,
  trace: 90,
}

const getPadLimit = (records: Record<string | number, any>) => {
  let max = 0

  for (var l in records) {
    max = Math.max(max, l.length)
  }

  return max
}

const padIndent = (str: string, max: number) => {
  if (str.length < max) return str + ' '.repeat(max - str.length)
  return str
}

const formatMessage = (level: ILevel, msg: string, variables: IRecordOfKeyNS, colorized: boolean = true) => {
  const finalMsg = msg.replace(/@{(!?[$A-Za-z_][$0-9A-Za-z\._]*)}/g, (_, name) => {
    let str = variables
    let isError

    if (name[0] === '!') {
      name = name.substr(1)
      isError = true
    }

    const ref = name.split('.')
    for (let i = 0; i < ref.length; i++) {
      const id = ref[i]
      str = typeof str === 'object' && str ? str[id] : undefined
    }

    if (typeof str === 'string') {
      if (!colorized || (str as string).includes('\n')) {
        return str
      }

      if (isError) {
        return '\u001b[31m' + str + '\u001b[39m'
      }

      return '\u001b[32m' + str + '\u001b[39m'
    }

    return util.inspect(str, false, null, colorized)
  })
  const vSub = variables && variables.sub || 'default'
  const sub = subsystems[colorized ? 0 : 1][vSub] || subsystems[+!colorized].default
  const padLimit = getPadLimit(levels)
  const indentLevel = padIndent(level, padLimit)

  if (colorized) {
    return '\u001b[' + levels[level] + 'm' + indentLevel + '\u001b[39m ' + sub + ' ' + finalMsg
  }

  return indentLevel + sub + ' ' + finalMsg
}

const output = (level: ILevel, msg: any[], variables: any) => {
  if (level !== 'message' && levels[level] <= levels[configProvider.logLevel]) {
    return
  }

  const vars = Object.assign({ sub: 'out' }, variables)
  const message = formatMessage(level, msg.join(' '), vars, process.stdout.isTTY)

  console.log(`[${configProvider.logTitle}] ${message}`)
}

export const logger = {
  time(label: string) {
    times.set(label, Date.now())
  },
  timeEnd(label: string, ...args: string[]) {
    const start = times.get(label)
    if (start) {
      const duration = Date.now() - start
      const level =
        duration <= 100 ? 35
          : duration <= 1000 ? 33 :
            duration >= 5000 ?
              29 : 31

      const colorDuration = '\u001b[' + level + 'm' + duration + '\u001b[39m '

      console.log(label + ' duration: ' + colorDuration + 'ms', ...args)
    }
  },
  fatal(variables: IRecordOfKeyNS, ...msg: any[]) {
    output('fatal', msg, variables)
  },
  error(variables: IRecordOfKeyNS, ...msg: any[]) {
    output('error', msg, variables)
  },
  warn(variables: IRecordOfKeyNS, ...msg: any[]) {
    output('warn', msg, variables)
  },
  message(variables: IRecordOfKeyNS, ...msg: any[]) {
    output('message', msg, variables)
  },
  info(variables: IRecordOfKeyNS, ...msg: any[]) {
    output('info', msg, variables)
  },
  debug(variables: IRecordOfKeyNS, ...msg: any[]) {
    output('debug', msg, variables)
  },
  trace(variables: IRecordOfKeyNS, ...msg: any[]) {
    output('trace', msg, variables)
  },
  output: console.log,
  println(...args: string[]) {
    console.log(configProvider.logTitle, ...args)
  },
  object(records: NonNullable<IRecordOfKeyNS>, symbol = '\n', header: string = '') {
    if (!records || typeof records !== 'object') {
      return
    }

    const padLimit = getPadLimit(records)
    const messages = []

    for (const key in records) {
      if (records.hasOwnProperty(key)) {
        const value = JSON.stringify(records[key], null, 2)
        const indentKey = padIndent(key, padLimit)

        messages.push(`${header || ''} ${indentKey} : ${value} `)
      }
    }

    console.log(messages.join(symbol))
  },
  setup(fallback: (provider: typeof configProvider) => void) {
    if (typeof fallback === 'function') {
      fallback(configProvider)
    }
  },
  levels: Object.keys(levels)
}