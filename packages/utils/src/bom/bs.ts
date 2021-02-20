export const Browser = {
    name: 'unknown',
    version: '0'
}
const userAgent = window.navigator.userAgent.toLowerCase();

if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
    Browser.name = RegExp.$1;
    Browser.version = RegExp.$2;
} else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) {
    Browser.name = 'safari';
    Browser.version = RegExp.$2;
}
