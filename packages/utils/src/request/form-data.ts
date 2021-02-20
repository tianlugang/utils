export namespace FormDataExt {
    export const append = (formData: FormData, value: any, key: string = ''): void => {
        switch (typeof value) {
            case 'function':
                value = value()
                append(formData, value, key)
                break
            case 'object':
                if (Array.isArray(value)) {
                    value.forEach(item => append(formData, item, `${key || ''}[]`))
                    return
                }
                for (const k in value) {
                    if (value.hasOwnProperty(k)) {
                        append(formData, value[k], key ? `${key}[${k}]` : k)
                    }
                }
                break
            default:
                formData.append(key, value)
                break
        }
    }
}
