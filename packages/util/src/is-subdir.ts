
import path from 'path' 

export function isSubdir(src: string, dest: string) {
    const srcArr = path.resolve(src).split(path.sep).filter(i => i)
    const destArr = path.resolve(dest).split(path.sep).filter(i => i)
    return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true)
}
