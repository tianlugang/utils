const intervalTables: Record<string, number> = {
    '': 1000,
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 86400000,
    w: 7 * 86400000,
    M: 30 * 86400000,
    y: 365 * 86400000,
}

export function parseInterval(interval: string | number): number {
    if (typeof (interval) === 'number') {
        return interval * 1000
    }

    let result = 0
    let lastSuffix = Infinity

    interval.split(/\s+/).forEach(function (x) {
        if (!x) return
        let m = x.match(/^((0|[1-9][0-9]*)(\.[0-9]+)?)(ms|s|m|h|d|w|M|y|)$/)

        if (!m || intervalTables[m[4]] >= lastSuffix || (m[4] === '' && lastSuffix !== Infinity)) {
            throw Error('invalid interval: ' + interval)
        }

        lastSuffix = intervalTables[m[4]]
        result += Number(m[1]) * intervalTables[m[4]]
    })

    return result
}