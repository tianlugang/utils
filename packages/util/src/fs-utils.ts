import fs from 'fs'

export const folderExists = (path: fs.PathLike) => {
    try {
        var stat = fs.statSync(path)
    } catch (_) {
        return false
    }

    return stat.isDirectory()
}

export const fileExists = (path: fs.PathLike) => {
    try {
        var stat = fs.statSync(path)
    } catch (_) {
        return false
    }

    return stat.isFile()
}

export const directoryExists = folderExists