function IsImageFile(type: string) {
    return type.indexOf('image/') === 0;
}

function IsImageDataURL(url: string) {
    return /^data:image\//.test(url);
}

function IsImageExtname(ext: string) {
    return /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(ext);
}

export const isImage = (file: string | File) => {
    switch (typeof file) {
        case 'string':
            return IsImageFile(file) || IsImageDataURL(file) || IsImageExtname(file);
        case 'object':
            if (file instanceof File) {
                return IsImageFile(file.type);
            }

            return false;
        default: return false;
    }
}
