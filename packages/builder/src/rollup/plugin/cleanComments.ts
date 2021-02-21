// @ts-nocheck
import path from 'path'

interface ICleanCommentsOptions { 
    preserved: string
    include: any
    exclude: any
}

export function cleanComments(options: Partial<ICleanCommentsOptions> = {}) {
    const MagicString = require('magic-string')
    const createFilter = require('rollup-pluginutils').createFilter

    function strip(str: string) {
        if (typeof str !== 'string') {
            throw new Error('expected a string')
        }
        return str.replace(/['"]use strict['"]/g, '')
    }

    function bom(str: string) {
        if (typeof str === 'string' && str.charAt(0) === '\ufeff') {
            return str.slice(1)
        }

        return str
    }

    function extract(str: string, custom?: string[]) {
        if (typeof str !== 'string') {
            throw new Error('has-banner expects a string.')
        }

        str = strip(bom(str)).replace(/^\s+/, '')
        var start = /^(\/[*!]+|\/\/)/.exec(str)

        if (!start) {
            return ''
        }

        var names = ['global', 'jshint', 'eslint']
        if (Array.isArray(custom)) {
            names = names.concat(custom)
        }

        var chars = start[0]
        str += '\n'

        var isLine = chars === '//'

        var end = isLine ?
            str.indexOf('\n') :
            str.indexOf('*/')

        if (end === -1) {
            return ''
        }

        var comment = str.slice(0, end + (isLine ? 1 : 2))
        var inner = str.slice(chars.length, end)
        inner = inner.replace(/^[\s\W]+|[\s\W]+$/g, '')

        var re = new RegExp('^' + names.join('|') + '[-: \\t]?')
        if (re.test(inner)) {
            return ''
        }
        return comment
    }

    // function replace(str, options) {
    //   if (!str) return ''

    //   options = options || {}
    //   var banner = extract(str, options.configNames)
    //   if (banner === '') {
    //     return str
    //   }

    //   if (options.keepProtected === true) {
    //     var m = /[^\s\w]+/.exec(banner)
    //     var lead = m ? m[0].trim() : ''
    //     if (lead[lead.length - 1] === '!') {
    //       return str
    //     }
    //   }

    //   return str.replace(banner, '')
    // }

    const filter = createFilter(options.include, options.exclude)
    const fixId = (id: string) => id.replace(/\0/, '')
    const extensions = ['.js', '.jsx', '.ts', 'tsx']
    const preserved = options.preserved || ''

    return {
        name: 'rollup-plugin-clear-comments',
        transform(code: string, id: string) {
            if (!filter(fixId(id))) {
                return
            }

            const ext = path.extname(id).toLowerCase();

            if (extensions.indexOf(ext) === -1) {
                return
            }

            const banner = extract(code)
            if (!banner || !!preserved && banner.includes(preserved)) {
                return
            }

            const magicString = new MagicString(code)
            const pos = code.indexOf(banner)

            magicString.remove(pos, pos + banner.length)

            magicString.trimStart()

            return {
                code: magicString.toString(),
                map: magicString.generateMap({
                    hires: true,
                }),
            };
        }
        // generateBundle(options, bundle, isWrite) {
        //   console.log(isWrite, 'generateBundle', options.file)
        // },
        // writeBundle(options, bundle) {
        //   console.log(bundle.fileName, 'writeBundle', options.file)
        // }
    };
}
export default cleanComments