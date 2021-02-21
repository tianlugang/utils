import fs from 'fs'
import path from 'path'
import { logger } from '@tlg/util'
import { resolveProj } from '../projrc' 
import { execScript, pushDir } from './ssh'

// const fs = require('fs-extra');
// const path = require('path');
// const os = require('os');
// const keyPath = path.join(os.homedir(), '.ssh/id_rsa.pub');
// const privateKey = fs.readFileSync(keyPath, 'utf8');

function runScripts(scripts: string) {
    logger.time('run-scripts')

    const { servers } = resolveProj()
    const promises = servers.map(({ destDir, ...opts }) => {
        return execScript(opts, scripts).then(stdout => {
            logger.println(`${opts.username}@${opts.host}\n` + stdout + '\n')
        })
    })

    Promise.all(promises).finally(() => {
        logger.timeEnd('run-scripts')
        process.exit(0)
    })
}

function listVersions() {
    logger.time('list versions')
    const { servers } = resolveProj()
    const promises = servers.map(({ destDir, ...opts }) => {
        return execScript(opts, `ls -lah ${destDir}`).then(stdout => {
            logger.println(`${opts.username}@${opts.host}\n` + stdout + '\n')
        })
    })

    Promise.all(promises).finally(() => {
        logger.timeEnd('list versions')
        process.exit(0)
    })
}

function removeVersion(versions: string) {
    logger.time('remove versions')
    const { servers } = resolveProj()
    const promises = servers.map(({ destDir, ...opts }) => {
        return execScript(opts, `cd ${destDir} && rm -rf ${versions}`).then(stdout => {
            logger.println(`${opts.username}@${opts.host}\n` + stdout + '\n')
        })
    })

    Promise.all(promises).finally(() => {
        logger.timeEnd('remove versions')
        process.exit(0)
    })
}

function publish(version?: string) {
    const { servers, rcDirectory } = resolveProj()
    let rcDir = rcDirectory

    if (!fs.existsSync(rcDir)) {
        return logger.println(`Current version does not exsits, publish aborted.`)
    }

    if (version && version.length > 0) {
        rcDir = path.join(rcDir, version)
        if (!fs.existsSync(rcDir)) {
            return logger.println(`${version} does not exists.`)
        }
    }

    logger.println('Now, start send `Project` to remote servers ...')
    logger.time('publish rcv')

    const promises = servers.map(({ destDir, ...opts }) => {
        return pushDir(opts, rcDir, destDir).then(() => {
            return execScript(opts, `ls -lah ${destDir}`)
        })
    })

    Promise.all(promises).finally(() => {
        logger.timeEnd('publish rcv')
        process.exit(0)
    })
}

export const deployer = {
    publish,
    removeVersion,
    listVersions,
    runScripts
}

export default deployer
