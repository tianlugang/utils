import * as os from 'os'

// 获取服务器内网URL，方便移动端测试
export function getServerUrl(protocol: string = 'http', port: number | string = 3000) {
    const ifaces = os.networkInterfaces()
    const addres: os.NetworkInterfaceInfo[] = []

    Object.keys(ifaces).map(face => ifaces[face]).forEach((addresses?: os.NetworkInterfaceInfo[]) => {
        if (addresses) {
            addresses.forEach(addr => {
                if (addr.family === 'IPv4') {
                    addres.push(addr)
                }
            })
        }
    })

    return addres.map(addr => protocol + '://' + addr.address + ':' + port)
}