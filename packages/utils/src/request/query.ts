export namespace QueryString {
    // 给url添加参数
    export const add = (url: string, query: any) => {
        return url + '?' + query
    }
}

