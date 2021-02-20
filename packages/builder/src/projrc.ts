import path from 'path'

export function resolveProj(root: string = process.cwd()): IProjectConfig {
    let config!: IProjectConfig
    const names = ['projrc', '.projrc']

    try {
        for (const name of names) {
            config = require(path.join(root, name))
            break
        }
    } catch (err) {
        throw err
    }

    return config
}

export interface IProjectTemplate {
    dir: string
    srcDir: string
    onlyCWD: boolean
    data: Record<string, any>
    render(content: string, data: Record<string, any>): string
}

export interface IProjectBoilerplate {
    path: string
    render?: Record<string, string | number | boolean> | Function
}

export interface IServerOptions {
    host: string
    username: string
    password: string
    destDir: string
}

export interface IProjectConfig {
    servers: IServerOptions[]
    rcDirectory: string
    template: IProjectTemplate
    boilerplates: IProjectBoilerplate[]
}