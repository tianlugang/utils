import { IncomingMessage, ServerResponse, METHODS } from 'http'

type ICorsMiddlewareOptions = {
    methods: typeof METHODS
    origin: string
    version: string
    contentType: string
    setHeader(res: ServerResponse): void
    disabled: boolean
}
const noop = function () { }
const corsMiddlewareOptions: ICorsMiddlewareOptions = {
    methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
    origin: '*',
    version: '3.2.1',
    contentType: 'application/json;charset=utf-8',
    setHeader: noop,
    disabled: false
}

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {function} next
 * @example
 *   app.all('*', httpCors)
 */
export function makeCorsMiddleware({ methods, origin, version, contentType, setHeader, disabled }: ICorsMiddlewareOptions = corsMiddlewareOptions) {
    return function corsAction(req: IncomingMessage, res: ServerResponse, next: () => void) {
        if (disabled === true) {
            return next()
        }
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Access-Control-Allow-Methods', methods.join(','))
        res.setHeader('X-Powered-By', version)
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With')
        res.setHeader('Content-Type', contentType) //这段仅仅为了方便返回json而已
        setHeader(res)
        if (req.method == 'OPTIONS') {
            //让options请求快速返回
            res.statusCode = 200
        } else {
            next()
        }
    }
}