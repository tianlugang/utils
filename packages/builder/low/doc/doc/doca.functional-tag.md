# 功能块标签

## 版本协议

- @version
  - 标识该项的版本号
  - 语法 `@version <version>`
- @author
  - 语法 `@author <name> [<emailAddress>]`
  - 标识该项的作者信息
- @copyright
  - 标识该项版权信息
  - 语法 `@copyright <some copyright text>`
- @since
  - 语法 `@since <version>`
  - 标识类、方法或其它标识符是在哪个特定版本添加进来的
- @license
  - 标识代码采用何种软件许可协议
  - 语法 `@license <identifier>`, [Software Package Data Exchange (SPDX)](https://spdx.org/licenses/)

## 事件监听

- @event
  - 语法 `@event {eventName} - desc`
  - 标识一个可触发的事件
- @emits
  - 语法: `@emits {eventName} - desc`
  - 标识方法被调用时将触发的事件的事件信息
- @listens
  - 语法 `@listens {eventName} - desc`
  - 标识函数或方法为指定事件的监听器

## 文件注释

- @file
  - 说明文件的功用, 在文件头注释中使用, 且在该文件中只能使用一次
  - 语法 `@file desc`

## 包与模块

- @namespace
  - 指定当前对象或者方法为一个命名空间
  - 语法 `@namespace [name]`
- @package
  - 将文件声明为一个`node package`的入口驱动(主文件), 且在该文件中只能使用一次
  - 语法: `@package desc`
  - 例如:
    ```js
    /**
     * @package 这是我的工具包
     * @name utils
     */
    ```
    上述注释声明该文件为包`utils`的入口文件, 在注释提取时，会在执行目录下生成标准的`packages/utlis/`
- @module
  - 声明将文件为一个模块, 默认情况下文件内的所有标识符都隶属于此模块
  - 语法 `@module <moduleName>`
- @exports
  - 声明那些模块成员将被导出
  - 语法 `@exports <name>`
  - 例如:
    ```js
    /**
     * @exports add
     */
    function add(a, b) {
      return b + a;
    }
    ```
- @requires
  - 语法 `@requires <someModuleName>`
  - 声明包或模块的依赖项
## 全局
- @global
  - 指定该类或者函数依赖的全局的对象
  - 语法 `@global <name1, name2, ...>`
- @ignore
  - 声明该段注释会被直接忽略，不参与文档化
  - 语法 `@ignore`
- @deprecated
  - 指明一个标识在代码中已经被弃用
  - 语法 `@deprecated [<some text>]`
- @borrows
  - 语法 `@borrows <that namepath> as <this namepath>`
  - 允许将另一个标识符的描述添加到描述
- @see
  - 语法 `@see <namepath>`
  - 表示可以参考另一个标识符的说明文档或者一个外部资源
- @todo
  - 说明要完成的任务或这将要实现的特性
  - 语法 `@todo desc`

## 通用

- @name
  - 语法 `@name <namepath or namehash>`
  - 声明对象的名称
- @function
  - 声明该项为一个函数或方法
  - 别名 `@method`
  - 语法 `@function [<FunctionName>]`
- @callback
  - 语法 `@callback <namepath>`
  - 回调函数的描述, 包括回调的参数和返回值
- @param
  - 语法 `@param {type} <name> - desc`
  - 描述某个函数或方法的参数, 包括参数名、参数类型、描述等
- @return
  - 语法 `@return {type} - desc`
  - 描述一个函数的返回值
- @throws
  - 描述函数可能会抛出的错误
  - 语法 `@throws {ErrorType} description`
- @type
  - 语法 `@type {typeName}`
  - 用一个表达式说明该标识符可能包含的值的类型
- @constant
  - 别名 `@const`
  - 声明该标识符为常量
- @default
  - 语法 `@default [<some value>]`
  - 声明该标识符的默认值
- @description
  - 描述一个标识
  - 别名 `@desc`
  - 语法 `@description <some description>`
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
- @readonly
  - 表明标识符为只读的
- @this
  - `this`关键字的指向
  - 语法 `@this <namePath>`

## 面向对象 - 混入

- @mixin
  - 标识该对象是一个 mixin（混入）对象, 表明该对象的属性和方法混入到其他对象; 然后, 可以将@mixes 标签添加到使用了该 mixin（混入）的对象
- @mixes
  - 语法 `@mixes <OtherObjectPath>`
  - 指示对象混入了`OtherObjectPath`对象的所有成员,被混入的对象就是一个@mixin

## 面向对象 - 列举

- @member
  - 列举类的成员
  - 语法 `@member {type} <name> -desc`
- @memberof
  - 标明成员隶属于哪一个类
  - 语法 `@memberof <parentNamepath>`或`@memberof! <parentNamepath>`

## 面向对象 - 类型

- @inner
  - 将标明该标识符作为它父标识符的内部成员, 它可以通过"Parent~Child"引用
  - 语法 `@inner {type} name - desc`
- @instance
  - 将标明该标识符作为它父标识符的实例成员, 它可以通过"Parent#Child"引用
  - 语法 `@instance {type} name - desc`
- @static
  - 将标明该标识符作为它父标识符的静态成员, 它可以通过"Parent.Child"引用
  - 语法 `@static {type} name - desc`

## 面向对象 - 继承

- @extends
  - 语法 `@extends <namepath>`
  - 指明标识符继承自哪个父类, 后面需要加父类名
- @class
  - 标明函数是一个构造器函数, 意味着需要使用 new 关键字来返回一个实例, 即使用 new 关键字实例化
  - 语法 `@class <name>`
- @constructs
  - 指定字面量对象是`指定类`的实例
  - 语法 `@constructs <name>`
- @lends
  - 将一个字面量对象的所有成员标记为某个标识符（类或模块）的成员
  - 语法 `@lends <namepath>`

## 面向对象 - 重写

- @override
  - 子类重写其父类同名的成员
  - 语法 `@override`
- @abstract
  - 父类的成员必须在子类中实现
  - 语法 `@abstract`

## 面向对象 - 接口

- @interface
  - 语法 `@interface <name>`
  - 使一个顶层标识符作为其他标识符的一个实现接口, 指明子标识符必须实现父标识符的方法和属性
- @implements

  - 标识一个接口实现类, 添加`@implements`到实现接口（例如, 一个构造函数）的顶层标识
  - 语法 `@implements <name>`
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

## 面向对象 - 访问

- @access
  - 指定该成员的访问级别（私有 private, 公共 public, 或保护 protected）
  - 语法 `@access <private|protected|public> [target]`
  - `private` 标标识符为私有, 不参与文档化
  - `protected` 表明标识符为受保护的, 通常情况下, 受保护的成员只能在被继承的子类中或在模块内部可以访问
  - `public` 标识符为公开的
