// 字符串长度截取
export const substr = (str: string, len: number) => {
    var temp, icount = 0, patrn = /[^\x00-\xff]/, strre = '';

    for (var i = 0; i < str.length; i++) {
        if (icount < len - 1) {
            temp = str.substr(i, 1);
            if (patrn.exec(temp) == null) {
                icount = icount + 1;
            } else {
                icount = icount + 2;
            }
            strre += temp;
        } else {
            break;
        }
    }

    return strre;
}
