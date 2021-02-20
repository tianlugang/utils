export namespace Debug {
    /**
     * 让所有元素显示边框
     */
    export function outline() {
        [].forEach.call(document.querySelectorAll('*'), function (a: HTMLElement) {
            a.style.outline = '1px solid #' + (~~(Math.random() * (1 << 24))).toString(16);
        });
    }

    /**
     * 直接编辑页面资源
     */
    export function pageEdit() {
        document.body.contentEditable = 'true';
    }

    /**
     * 页面直接编辑样式
     */
    export function styleEdit() {
        let style = document.createElement('style');
        style.style.cssText = 'display: block;position: fixed;width: 100%;height: 240px;border-top: 2px solid rgb(170, 170, 170);background-color: rgb(255, 255, 255);overflow-x: hidden;overflow-y: auto;z-index: 9999;bottom: 0;left: 0;';
        style.setAttribute('contentEditable', 'true');
        document.body.style.paddingBottom = '300px';
        document.body.appendChild(style);
    }

    /**
     * 打开一个可编辑的窗口
     */
    export function openEditWindow() {
        return open('data:text/html, <html contenteditable>');
    }

    /**
     * json字符串美化
     */
    export function viewJson(args: object) {
        if (!args) return;
        let div = document.createElement('div');
        div.style.cssText = 'overflow:auto;position:fixed;bottom:10px;left:10px;height:auto;width:auto;max-height:100%;max-width:100%;width:100%;padding:10px;color:#f60;background-color:#fff;white-space: pre;border: 1px solid #aaa;border-radius: 4px;box-shadow: inset 0 0 50px #aaa;font-size:16px;resize:both;';
        let divHtml = '';
        for (let [, json] of Object.entries(args)) {
            divHtml += `<br/>`;
            divHtml += JSON.stringify(json, null, 6);
            divHtml += '<br/>';
        }
        div.innerHTML = divHtml;
        document.body.style.paddingBottom = '320px';
        document.body.appendChild(div);
    }
}