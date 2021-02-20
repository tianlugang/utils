const errors: Error[] = []

export function create(name: string, err: Error | string, ...args: string[]) {
    var i = 0;
    var e = new Error();
    var s = err instanceof Error ? err.message : err

    e.name = name;
    e.message = s.replace(/\$\d+/g, meta => args ? args[i++] : meta);
    return e;
}

export function collect(error: Error) {
    if (error instanceof Error) {
        errors.push(error);
    }
}

export function display() {
    if (errors.length === 0) {
        return;
    }

    errors.forEach(console.error)
    errors.length = 0;
}