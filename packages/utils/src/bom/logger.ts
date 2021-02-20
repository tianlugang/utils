const master = window.console

export namespace logger {
    export const config = {
        level: 5,
        title: 'log',
        info: {
            level: 0,
            color: '#3EAF0E'
        },
        debug: {
            level: 1,
            color: '#007bff'
        },
        warn: {
            level: 2,
            color: '#b9a23a'
        },
        error: {
            level: 3,
            color: '#f50c0c'
        },
        fatal: {
            level: 4,
            color: '#ff7bff'
        }
    }
    export type IType = keyof Omit<typeof config, 'level' | 'title'>
    export const print = (type: IType, args: any[] | any) => {
        const { level, color } = config[type]

        if (config.level < level) return

        const spliter = '-'.repeat(15)
        const title = `%c${config.title + type}`
        const titleStyle = 'padding:5px;font-size:14px;color:#fff;background-color:'.concat(color)
        const valueStyle = 'font-size:14px;color:'.concat(color)

        master.log(spliter)
        master.log(title, titleStyle)
        Array.isArray(args)
            ? args.forEach(value => {
                if (typeof value === 'object') {
                    return master.dir(value)
                }
                master.log(`%c${value.toString()}`, valueStyle)
            })
            : master.log(`%c${args}`, valueStyle)
        master.log(spliter)
        master.log('\n')
    }

    export const info = (...args: any[]) => print('info', args)
    export const debug = (...args: any[]) => print('debug', args)
    export const warn = (...args: any[]) => print('warn', args)
    export const error = (...args: any[]) => print('error', args)
    export const fatal = (...args: any[]) => print('fatal', args)
    export const clear = () => master.clear()
}