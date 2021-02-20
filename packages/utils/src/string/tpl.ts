
// 格式化字符串
export namespace Template {
    // 用来替换模板字符串
    export function v0(str: string) {
        return str.replace(/\${([^{}]+)}/g, function (_a, b) {
            try {
                return eval(b) || '';
            } catch (e) {
                return '';
            }
        });
    }

    // abc{1}de{2} => 
    export function v1(str: string, ...args: any[]) {
        return str.replace(/{(\d+)}/g, (_m, i) => args[i]);
    }
}