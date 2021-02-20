export type IAddressObject = NonNullable<ReturnType<typeof parseAddress>>

//
// Allow:
//
//  - https:localhost:1234        - protocol + host + port
//  - localhost:1234              - host + port
//  - 1234                        - port
//  - http::1234                  - protocol + port
//  - https://localhost:443/      - full url + https
//  - http://[::1]:443/           - ipv6
//  - unix:/tmp/http.sock         - unix sockets
//  - https://unix:/tmp/http.sock - unix sockets (https)
//
// TODO: refactor it to something more reasonable?
//
//        protocol :  //      (  host  )|(    ipv6     ):  port  /
export function parseAddress(addr: string) {
    let m = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(addr)

    if (m) return {
        proto: m[2] || 'http',
        host: m[6] || m[7] || 'localhost',
        port: m[8] || '9000',
    }

    m = /^((https?):(\/\/)?)?unix:(.*)$/.exec(addr)

    if (m) return {
        proto: m[2] || 'http',
        path: m[4],
    }

    return null
}

// get app address
export function getAddresses(listen?: string | string[], option?: string, invalidPrompt?: (addr: string) => void) {
    const parsed: IAddressObject[] = []
    let addresses = ['9000']

    if (option) {
        addresses = [option]
    } else if (Array.isArray(listen)) {
        addresses = listen
    } else if (listen) {
        addresses = [listen]
    }

    addresses.forEach(any => {
        const addr = parseAddress(any)

        if (addr) {
            parsed.push(addr)
        } else {
            // invalid listen address
            invalidPrompt && invalidPrompt(any)
        }
    })

    return parsed
}

export default {
    getAddresses,
    parseAddress
}