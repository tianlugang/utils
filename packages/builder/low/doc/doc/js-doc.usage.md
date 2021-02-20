# doc 文档注释使用规范

## 标签说明

1. doca 的标签均以 `@`(at) 符号开头，分为两类:
- 块标签, 文本行尾必须跟一个换行符
- 内联标签, 其文本必须用花括号`{@tagName 内容}`括起来。 `{`表示行内联标签的开始，而`}`表示内联标签的结束。如果标签文本中包含右花括号`}`，则必须用反斜线`\`进行转义

2. 对象成员的路径表示

   - `#` 实例方法或属性
   - `.` 静态方法或属性
   - `~` 内部函数或变量
   - 例如：

   ```js
   /** @constructor */
   Person = function() {
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

## 块标签

- @example
  - 提供一个如何使用描述项的例子, 此标签的文本将显示为高亮代码
  - 例如:
    ```js
    /**
     * @example
     *   add(5, 10); // returns 15
     */
    function add(a, b) {
      return b + a;
    }
    ```
- @exports
  - 标识拿些 JavaScript 模块成员将被导出
  - 例如:
    ```js
    /**
     * @exports
     */
    function add(a, b) {
      return b + a;
    }
    ```
- @external
  - 标识一个在当前包外部定义的类，命名空间，或模块
  - 别名 `@host`
  - 语法 `@external <NameOfExternal>`
- @file
  - 提供文件的说明, 在文件开头的注释部分使用该标签,且只能使用一次
  - 别名 `@fileoverview`或`@overview`
- @fires
  - 标明当一个方法被调用时将触发一个指定类型的事件
  - 别名 `@emits`
- @function
  - 表示当前对象为一个函数
  - 别名 `@func`或`@method`
  - 语法 `@function [<FunctionName>]`
- @global
  - 指定一个在文档的标识是为全局性的标识
- @ignore
  - 表示在代码中的注释不应该出现在文档中，该段注释会被直接忽略
- @implements

  - 标识一个接口实现类，添加@implements 标签到实现接口（例如，一个构造函数）的顶层标识。不需要将@implements 标签添加到实现接口（例如，实现的实例方法）的每个成员上
  - 语法 `@implements {typeExpression}`
  - 例如：

    ```js
    /**
     * @interface
     */
    class Color {
      /**
       * @returns {Array<number>}
       */
      rgb() {
        throw new Error("not implemented");
      }
    }

    /**
     * @class
     * @implements {Color}
     */
    class TransparentColor {
      // 继承并`Color#rgb`
      rgb() {
        // ...
      }

      /**
       * @returns {Array<number>}
       */
      rgba() {
        // ...
      }
    }
    ```

* @inheritdoc
  - 指示该标识应继承其父类的文档
* @inner
  - 将标明该标识符作为它父标识符的内部成员，它可以通过 "Parent~Child" 被引用。
* @instance
  - 将标明该标识符作为它父标识符的实例成员，它可以通过"Parent#Child"被引用。
* @interface
  - 语法 `@interface [<name>]`
  - 使一个顶层标识符作为其他标识符的一个实现接口, 指明子标识符必须实现父标识符的方法和属性
* @lends
  - 将一个字面量对象的所有属性标记为某个标识符（类或模块）的成员
  - 语法 `@lends <namepath>`
* @license
  - 标识代码采用何种软件许可协议
  - 语法 `@license <identifier>`, [ Software Package Data Exchange (SPDX)](https://spdx.org/licenses/)
* @listens
  - 语法 `@listens <eventName>`
  - 为一个监听器指定事件
* @member
  - 别名 `@var`
  - 表明成员基本种类
  - 语法 `@member [<type>] [<name>]`
* @memberof
  - 语法 `@memberof <parentNamepath>`或`@memberof! <parentNamepath>`
  - 标明成员隶属于哪一个父级标识符。
* @mixes
  - 语法 `@mixes <OtherObjectPath>`
  - 指示当前对象混入了 OtherObjectPath 对象的所有成员,被混入的对象就是一个@mixin
* @mixin
  - 标识该对象是一个 mixin（混入）对象, 表明该对象的属性和方法混入到其他对象。然后，可以将@mixes 标签 添加到使用了该 mixin（混入）的对象
* @module
  - 将当前文件标注为一个模块，默认情况下文件内的所有标识符都隶属于此模块，除非文档另有说明
  - 语法 `@module [[{<type>}] <moduleName>]`
* @name
  - 语法 `@name <namePath>`
  - 重定义一个对象的名称
* @namespace
  - 语法 `@namespace [{<type>}] <SomeName>]`
  - 指明对象是一个命名空间
* @override
  - 指明一个标识符重写其父类同名的标识符。
* @param
  - 别名 `arg`或`argument`
  - 指定对某个函数的参数的各项说明，包括参数名、参数数据类型、描述等
* @private
  - 表明标标识符为私有，不参与文档化
  - 语法 `@private [{typeExpression}]`
* @property
  - 别名: `prop`
  - 表明命名空间或其它对象的静态属性列表
  - 语法 `@prop {type} [name] - desc`
* @protected
  - 语法 `@protected [{typeExpression}]`
  - 表明标识符为受保护的，通常情况下，受保护的成员只能在被继承的子类中或在模块内部可以访问
* @public
  - 标识符为公开的
* @readonly
  - 表明标识符为只读的
* @requires
  - 语法 `@requires <someModuleName>`
  - 记录一个模块需要的依赖项
* @returns
  - 描述一个函数的返回值, 语法和@param 类似
  - 别名 `@return`
* @see
  - 语法 `@see <namepath>`或`@see <text>`
  - 表示可以参考另一个标识符的说明文档，或者一个外部资源
* @since
  - 语法 `@since <versionDescription>`
  - 标明一个类，方法，或其它标识符是在哪个特定版本开始添加进来的。
* @static
  - 标明一个在父类中的标识符不需实例即可使用的静态成员
* @summary
  - 声明一个完整描述的一个简写版本
* @this
  - `this`关键字的指向
  - 语法 `@this <namePath>`
* @throws
  - 别名 `exception`
  - 描述函数可能会抛出的错误
  - 语法 `@throws free-form description`或`@throws {<type>} free-form description`或 `@throws {<type>}`
* @todo
  - 说明要完成的任务
* @tutorial
  - 语法 `@tutorial <tutorialID>`
  - 插入一个指向向导教程的链接，作为文档的一部分
* @type
  - 语法 `@type {typeName}`
  - 用一个表达式说明一个标识符可能包含的值的类型，或由函数返回值的类型
* @typedef
  - 语法 `@typedef [<type>] <namepath>`
  - 描述自定义类型
* @variation
  - 区分具有相同名称的不同的对象
  - @variation <variationNumber>
* @version
  - 表示该项的版本
* @abstract
  - 该成员（一般指父类的方法）必须在继承的子类中实现（或重写）
  - 别名 `@virtual`

- @access
  - 指定该成员的访问级别（私有 private，公共 public，或保护 protected）
  - 语法 `@access <private|protected|public>`
- @alias
  - 语法 `@alias <aliasNamepath>`
  - 标签标记成员有一个别名
- @augments
  - 别名 `@extends`
  - 语法 `@augments <namepath>`
  - 指明标识符继承自哪个父类，后面需要加父类名
- @author
  - 语法 `@author <name> [<emailAddress>]`
  - 说明一个项目的作者。
- @borrows
  - 语法 `@borrows <that namepath> as <this namepath>`
  - 允许将另一个标识符的描述添加到当前描述
- @callback
  - 语法 `@callback <namepath>`
  - 回调函数的描述, 包括回调的参数和返回值
- @class
  - 别名 `@constructor`
  - 语法 `@class [<type> <name>]`
  - 标明函数是一个构造器函数，意味着需要使用 new 关键字来返回一个实例，即使用 new 关键字实例化
- @classdesc
  - 语法 `@classdesc <some description>`
  - 用于为类提供一个描述，这样和构造函数的描述区分开来
- @constant
  - 别名 `@const`
  - 标签指明这个对象是一个常量
- @constructs
  - 当使用对象字面量形式定义类（例如使用@lends 标签）时，可使用@constructs 标签标明这个函数用来作为类的构造实例
  - 语法 `@constructs [<name>]`
- @copyright
  - 描述一些版权信息
  - 语法 `@copyright <some copyright text>`
- @default
  - 语法 `@default [<some value>]`
  - 别名 `@defaultvalue`
  - 声明默认值
- @deprecated
  - 指明一个标识在代码中已经被弃用
  - 语法 `@deprecated [<some text>]`
- @description
  - 描述一个标识
  - 别名 `@desc`
  - 语法 `@description <some description>`
- @enum
  - 描述一个静态属性值的全部相同的集合
  - 语法 `@enum [<type>]`
- @event
  - 定义一个事件描述
  - 描述一个可触发的事件，一个典型的事件是由对象定义的一组属性来表示,标签来定义事件的具体类型，您可以使用@fires 标记，以表明这个种方法可以触发该事件。你还可以使用@listens 标签，以指示表明用这个表示来侦听该事件
  - 语法 `@event <className>#[event:]<eventName>`

## 内联标签

- @link
  - 创建一个链接到您指定的 namepath 或 URL
  - 别名 `@linkcode`或者`@linkplain`
  - 语法
    - {@link namepathOrURL}
    - [link text]{@link namepathOrURL}
    - {@link namepathOrURL|link text}
    - {@link namepathOrURL link text (after the first space)}
