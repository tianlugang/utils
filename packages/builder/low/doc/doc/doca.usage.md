# doca 使用规范

不同于`es-doc`与`js-doc`的新型文档化工具

1. doca 的标签均以`@`(at)符号开头, 分为三类:

- [流程块标签](./doca.flow-tag.md), 用于书写明确代码逻辑, 规划文档流程
- [功能块标签](./doca.functional-tag.md), 文本行尾必须跟一个换行符
- [内联标签](./doca.inline-tag.md), 其文本必须用花括号括起来, 如: `{@tagName 内容}`, `{`表示行内联标签的开始, 而`}`表示内联标签的结束, 如果标签文本中包含右花括号`}`, 则必须用反斜线`\`进行转义, 允许使用`\`来折行

2. 对象成员的路径表示法

   - `#` 实例方法或属性
   - `.` 静态方法或属性
   - `~` 内部函数或变量
   - 例如：

   ```js
   /** @constructor */
   const Person = function() {
     this.say = function() {
       return "I'm an instance.";
     };

     function say() {
       return "I'm inner.";
     }
   };
   Person.say = function() {
     return "I'm static.";
   };
   ```

   使用文档化标签来描述代码:

   - `Person#say`表示"say"是"Person"的实例方法
   - `Person.say`表示"say"是"Person"的静态方法
   - `Person~say`表示"say"是"Person"的内部函数

3. 内置操作符

   - `|`: `逻辑或`, 例如: `@param {string|object} attr& - desc`, 表示`attr`为`string`或`object`类型
   - `&`: `逻辑且`, 例如: `@method set(name&, value&, expire|) - desc`, 表示 `name`与`value` 为比传参数, `expire`为可选参数
   - `!`: `逻辑非`, 例如: `@param {string!} attr - desc`, 表示 `attr`表示`attr`为非字符串以外的任何类型
   - `-`: `连接符`, 连接符的前后必须有空格, 例如: `@param {string} attr - desc`, 其中`-`用于隔断`参数名`与`参数描述`
   - `<,>`: `数组域`, 表示一个数组, 例如:`@returns {array<number|number>} - desc` 表示返回一个数组, 数组内元素可能是字符串或者数字类型
   - `{,}`: `对象域`, 表示一个对象, 例如:`@returns {object{name: string, age: number}}`
   - `(,)`: `方法域`, 表示一个方法, 例如:`@method get(name&) desc`, 表示`get`是一个方法
