import { IServerOptions } from "../projrc"

let ssh2utils: any = null

function getSSH2Utils() {
    if (!ssh2utils) {
        const SSH2Utils = require('ssh2-utils')
        ssh2utils = new SSH2Utils()
    }

    return ssh2utils
}

// 在服务器上执行指令
export function execScript(server: Omit<IServerOptions, 'destDir'>, scripts: string) {
    return new Promise<string>((resolve, reject) => {
        if (typeof scripts !== 'string' || !scripts) {
            return reject(new Error('Invalid Command.'))
        }

        getSSH2Utils().exec(server, scripts, (err: Error | null, stdout: string) => {
            if (err) {
                reject(err)
            } else {
                resolve(stdout)
            }
        })
    })
}

// 复制文件夹到远程服务器指定的目录
export function pushDir(server: Omit<IServerOptions, 'destDir'>, src: string, dest: string) {
    return new Promise((resolve, reject) => {
        getSSH2Utils().putDir(server, src, dest, (err: Error | null) => {
            if (err) {
                reject(err)
            } else {
                resolve(undefined)
            }
        })
    })
}

export default { execScript, pushDir }