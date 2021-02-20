export function throws(message: string) {
  var error = new Error(message)

  error.name = 'AssertError'

  throw error
}

export function ok(expr: any, message: string) {
  if (expr == null || expr === false || expr instanceof Error) {
    throws(message)
  }
}

export function ifTrue(expr: boolean, message: string) {
  if (expr !== true) {
    throws(message)
  }
}

export function ifFlase(expr: boolean, message: string) {
  if (expr !== false) {
    throws(message)
  }
}

export function ifNil(expr: any, message: string) {
  if (expr == null) {
    throws(message)
  }
}

export function ifError(expr: any, message: string) {
  if (expr instanceof Error) {
    throws(message)
  }
}

export function debug(fn: (...args: any[]) => void, message: string, ...args: any[]) {
  if (typeof fn === 'function') {
    try {
      fn(...args)
    } catch (error) {
      throws(message + '->' + error.message)
    }
  } else {
    throws(message)
  }
}

export function report(error: any, callback: (message: string, ...args: string[]) => void) {
  if (error instanceof Error && typeof callback === 'function') {
    const email = 'tianlugang@yeah.net'
    const qq = '2678962889'
    const message = `Current Error Information: ${error.message}, the error may be caused by us, if you can\'t solve it, please contact me. My email ${email}, QQ: ${qq}.`

    callback(message, email, qq)
  }
}