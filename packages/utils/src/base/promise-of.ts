type ErrnoException = Error

export function promiseOf<D>(promise: Promise<D>) {
    return promise
        .then(data => [null, data] as [null, D])
        .catch(err => [err, null] as [ErrnoException, null])
}