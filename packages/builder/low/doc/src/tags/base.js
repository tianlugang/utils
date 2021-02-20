/**
 * @file 定义标签的几类
 */
const hint = require('../utils/hint');

/**
 * @access public
 */
const TAG_LIST = [
    // 内联标签
    "link", "text", "source",

    // 流程块标签
    "section", "title", "step",

    // 功能块标签
    // 版权协议
    "version", "author", "copyright", "since", "license",
    // 事件
    "event", "emits", "listens",
    // 文件
    "file",
    // 包与模块
    "namespace", "package", "module", "exports", "requires", "keyword",
    // 全局通用
    "global", "ignore", "deprecated", "borrows", "see", "todo",
    "name", "function", "callback", "param", "return", "throws",
    "type", "constant", "default", "description", "example", "readonly", "this",
    // 对象混入
    "mixin", "mixes",
    // 面向对象
    "member", "memberof", "inner", "instance", "static", "extends", "class",
    "property",
    "constructs", "lends", "override", "abstract", "interface", "implements", "access"
];

/**
 * 标签别名
 */
const TAG_ALIAS = {
    desc: 'description',
    returns: 'return',
    dependencies: 'requires'
};

/**
 * @access public [Tag]
 */
const TAG_TYPE = {
    inline: "inlineBlock",
    flow: "flowBlock",
    functional: "functionalBlock"
};

/**
 * 定义一个不可变对象
 * @param {*} val
 * @access private
 * @memberof Tag
 */
function setImmutableProperty(val) {
    return {
        value: val,
        configurable: false,
        writable: false,
        enumerable: false
    };
}

/**
 * 获取标签名称
 * @access private
 * @memberof Tag
 * @param {string} name 标签名称
 */
function getName(name) {
    if (typeof name !== "string" || !name.trim()) {

        throw new Error(
            "TagName must be a valid-string，eg: package"
        );
    }
    name = name.replace(/\s+/g, "");

    return name.charAt(0) === "@" ? name : "@" + name;
}

/**
 * @access private
 * @memberof Tag
 * @param {string} type
 */
function getType(type) {
    return type in TAG_TYPE ? TAG_TYPE[type] : TAG_TYPE.functional;
}

/**
 * @module tag
 * @desc 声明一个标签
 */
class Tag {
    /**
     * @param {string} name 标签的名称
     * @param {string} [type=functionalBlock] 标签的类型
     */
    constructor(name, type) {
        name = getName(name);
        type = getType(type);

        Object.defineProperties(this, {
            // 标签的名称
            name: setImmutableProperty(name),

            // 标签的类型
            type: setImmutableProperty(type)
        });

        this.id = null;            // 标签的ID
        this.style = new Set();    // 标签的样式, 字符串表示类名，对象表示 行内属性
        this.dataset = new Map();  // 标签的数据属性
        this.children = [];        // 标签的子节点
    }

    /**
     * 获取第n个子节点
     * @param {number} n 子节点索引
     */
    get(n) {
        return this.children[n];
    }

    /**
     * @desc 子节点遍历, callback 返回 `true`: 执行`for-i: continue`, 返回`false`: 执行`or-i: break`
     * @param {function} callback
     */
    each(callback) {
        if (typeof callback !== "function") {
            return;
        }

        const children = [...this.children];
        children.forEach((value, index) => {
            switch (callback(value, index, this.children)) {
                case true:
                    children.splice(index, 1);
                    break;
                case false:
                    children.splice(index);
                    break;
                default:
                    break;
            }
        });
    }
}

/**
 * @desc 标签异常处理
 */
class TagError extends Error {
    constructor(message, tagName) {
        super();
        this.name = "TagError";
        this.message = message;
        this.tagName = tagName;
    }
}

/**
 * @desc 是否为内置标签
 * @param {string} tagName - 标签名
 * @returns {boolean} 
 */
function getTagName(tagName) {
    if (tagName.charAt(0) === '@') {
        tagName = tagName.substring(1);
    }

    if (TAG_LIST.includes(tagName)) {
        return tagName;
    }

    if (tagName in TAG_ALIAS) {
        return TAG_ALIAS[tagName];
    }

    throw new TagError(`${tagName} is not native tag`, tagName);
}

/**
 * 标签配置
 * @access public
 */
const TAGS = {
    // * 内联功能性标记
    /**
     * @name Link
     * @description
     *  1. 用于链接一些外部资源，该资源可能来自于网络中其他主机
     *  2. 使用时的语法形式: `text`{@link URI}
     */
    link: {
        name: "@link",
        type: "inline",
        syntax: []
    },

    /**
     * @name Text
     * @description
     *  1. 定义一段文本, 可通过设置`attr`改变文本样式
     *  2. 语法 `text`{@text attr}
     */
    text: {
        name: "@text",
        type: "inline",
        syntax: []
    },

    /**
     * @name Source
     * @description
     *  1.  定义一个外链资源，如图片、视频、音频、iframe 内嵌页等, 外链资源如果是块元素，
     *      将折行到新行，然后水平居中展示在其父容器中
     *  2. 语法 `text`{@source attr}(URL)
     */
    source: {
        name: "@source",
        type: "inline",
        syntax: []
    },

    // * 流程管理标签
    /**
     * @name Section
     * @description
     *  1. 声明一个逻辑块，可搭配`@step`或者`@title`实现一个代码块，直到遇到`@section`结束
     *  2. 语法: `@section {PathLink} name - desc`
     */
    section: {
        name: "@section",
        type: "flow",
        syntax: []
    },
    /**
     * @name Title
     * @description
     *  1. 声明逻辑块的标题, 可在`@section`逻辑块中开启子逻辑块，直到遇到新的同级`@title`结束，或者`@section`结束
     *  2. 语法: `@title {size<1~6>} desc ...`
     */
    title: {
        name: "@title",
        type: "flow",
        syntax: []
    },
    /**
     * @name Title
     * @description
     *  1. 声明一个逻辑步骤，可生成跳转到源码指定位置的链接
     *  2. 语法: `@step [serial-number] - desc`
     */
    step: {
        name: "@step",
        type: "flow",
        syntax: []
    },

    // * 功能性标签
    /**
     * @name Version
     * @description
     *  1. 标识该项的版本号
     *  2. 语法: `@version <version>`
     */
    version: {
        name: "@version",
        type: "funtional",
        syntax: []
    },
    /**
     * @name Author
     * @description
     *  1. 标识该项的作者信息
     *  2. 语法: `@author <name> [<emailAddress>]`
     */
    author: {
        name: "@author",
        type: "funtional",
        syntax: []
    },
    /**
     * @name Copyright
     * @description
     *  1. 标识该项版权信息
     *  2. 语法: `@copyright <some copyright text>`
     */
    copyright: {
        name: "@copyright",
        type: "funtional",
        syntax: []
    },
    /**
     * @name Since
     * @description
     *  1. 标识类、方法或其它标识符是在哪个特定版本添加进来的
     *  2. 语法: `@since <version>`
     */
    since: {
        name: "@since",
        type: "funtional",
        syntax: []
    },
    /**
     * @name License
     * @description
     *  1. 标识代码采用何种软件许可协议
     *  2. 语法: `@license <identifier>`
     */
    license: {
        name: "@license",
        type: "funtional",
        syntax: []
    },

    // * - 事件监听
    /**
     * @name event
     * @description
     *   1. 语法 `@event {eventName} - desc`
     *   2. 标识一个可触发的事件
     */
    event: {
        name: "@event",
        type: "functional",
        syntax: []
    },
    /**
     * @name emits
     * @description
     *   1. 语法: `@emits {eventName} - desc`
     *   2. 标识方法被调用时将触发的事件的事件信息
     */
    emits: {
        name: "@emits",
        type: "functional",
        syntax: []
    },
    /**
     * @name listens
     * @description
     *   1. 语法 `@listens {eventName} - desc`
     *   2. 标识函数或方法为指定事件的监听器
     */
    listens: {
        name: "@listens",
        type: "functional",
        syntax: []
    },

    // * - 文件注释

    /**
     * @name file
     * @description
     *   1. 说明文件的功用, 在文件头注释中使用, 且在该文件中只能使用一次
     *   2. 语法 `@file desc`
     */
    file: {
        name: "@file",
        type: "functional",
        syntax: []
    },

    // * - 包与模块
    /**
     * @name namespace
     * @description
     *   1. 指定当前对象或者方法为一个命名空间
     *   2. 语法 `@namespace [name]`
     */
    namespace: {
        name: "@namespace",
        type: "functional",
        syntax: []
    },
    /**
     * @name package
     * @description
     *   1. 将文件声明为一个`node package`的入口驱动(主文件), 且在该文件中只能使用一次
     *   2. 语法: `@package desc`
     * @example 
     *
     */
    package: {
        name: "@package",
        type: "functional",
        syntax: []
    },
    /**
     * @name module
     * @description
     *   1. 声明将文件为一个模块, 默认情况下文件内的所有标识符都隶属于此模块
     *   2. 语法 `@module <moduleName>`
     */
    module: {
        name: "@module",
        type: "functional",
        syntax: []
    },
    /**
     * @name exports
     * @description
     *   1. 声明那些模块成员将被导出
     *   2. 语法 `@exports <name>`
     */
    exports: {
        name: "@exports",
        type: "functional",
        syntax: []
    },
    /**
     * @name requires
     * @description
     *   1. 语法 `@requires <someModuleName>`
     *   2. 声明包或模块的依赖项
     */
    requires: {
        name: "@requires",
        type: "functional",
        syntax: []
    },
    /**
     * @name keyword
     * @description
     *   1. 语法 `@keyword word word ...`
     *   2. 声明包或模块的的关键词
     */
    keyword: {
        name: "@keyword",
        type: "functional",
        syntax: []
    },
    // * - 全局
    /**
     * @name global
     * @description
     *   1. 指定该类或者函数依赖的全局的对象
     *   2. 语法 `@global <name1, name2, ...>`
     */
    global: {
        name: "@global",
        type: "functional",
        syntax: []
    },
    /**
     * @name ignore
     * @description
     *   1. 声明该段注释会被直接忽略，不参与文档化
     *   2. 语法 `@ignore`
     */
    ignore: {
        name: "@ignore",
        type: "functional",
        syntax: []
    },
    /**
     * @name deprecated
     * @description
     *   1. 指明一个标识在代码中已经被弃用
     *   2. 语法 `@deprecated [<some text>]`
     */
    deprecated: {
        name: "@deprecated",
        type: "functional",
        syntax: []
    },
    /**
     * @name borrows
     * @description
     *   1. 语法 `@borrows <that namepath> as <this namepath>`
     *   2. 允许将另一个标识符的描述添加到描述
     */
    borrows: {
        name: "@borrows",
        type: "functional",
        syntax: []
    },
    /**
     * @name see
     * @description
     *   1. 语法 `@see <namepath>`
     *   2. 表示可以参考另一个标识符的说明文档或者一个外部资源
     */
    see: {
        name: "@see",
        type: "functional",
        syntax: []
    },
    /**
     * @name todo
     * @description
     *   1. 说明要完成的任务或这将要实现的特性
     *   2. 语法 `@todo desc`
     */
    todo: {
        name: "@todo",
        type: "functional",
        syntax: []
    },

    // * - 通用
    /**
     * @name name
     * @description
     *   1. 语法 `@name <namepath or namehash>`
     *   2. 声明对象的名称
     */
    name: {
        name: "@name",
        type: "functional",
        syntax: []
    },
    /**
     * @name function
     * @description
     *   1. 声明该项为一个函数或方法
     *   2. 别名 `@method`
     *   3. 语法`@function [<FunctionName>]`
     */
    function: {
        name: "@function",
        type: "functional",
        syntax: []
    },
    /**
     * @name callback
     * @description
     *   1. 语法 `@callback <namepath>`
     *   2. 回调函数的描述, 包括回调的参数和返回值
     */
    callback: {
        name: "@callback",
        type: "functional",
        syntax: []
    },
    /**
     * @name param
     * @description
     *   1. 语法 `@param {type} <name> - desc`
     *   2. 描述某个函数或方法的参数, 包括参数名、参数类型、描述等
     */
    param: {
        name: "@param",
        type: "functional",
        syntax: []
    },
    /**
     * @name return
     * @description
     *   1. 语法 `@return {type} - desc`
     *   2. 描述一个函数的返回值
     */
    return: {
        name: "@returns",
        type: "functional",
        syntax: []
    },
    /**
     * @name throws
     * @description
     *   1. 描述函数可能会抛出的错误
     *   2. 语法 `@throws {ErrorType} description`
     */
    throws: {
        name: "@throws",
        type: "functional",
        syntax: []
    },
    /**
     * @name type
     * @description
     *   1. 语法 `@type {typeName}`
     *   2. 用一个表达式说明该标识符可能包含的值的类型
     */
    type: {
        name: "@type",
        type: "functional",
        syntax: []
    },
    /**
     * @name constant
     * @description
     *   1. 别名 `@const`
     *   2. 声明该标识符为常量
     */
    constant: {
        name: "@constant",
        type: "functional",
        syntax: []
    },
    /**
     * @name default
     * @description
     *   1. 语法 `@default [<some value>]`
     *   2. 声明该标识符的默认值
     */
    default: {
        name: "@default",
        type: "functional",
        syntax: []
    },
    /**
     * @name description
     * @description
     *   1. 描述一个标识
     *   2. 别名 `@desc`
     *   3. 语法`@description <some description>`
     */
    description: {
        name: "@description",
        type: "functional",
        syntax: []
    },
    /**
     * @name example
     * @description
     *   1. 提供一个如何使用描述项的例子, 此标签的文本将显示为高亮代码
     *   2. 语法 `@example - jscode`
     */
    example: {
        name: "@example",
        type: "functional",
        syntax: []
    },

    /**
     * @name readonly
     * @description
     *   1. 表明标识符为只读
     *   2. 语法 `@readonly`
     */
    readonly: {
        name: "@readonly",
        type: "functional",
        syntax: []
    },
    /**
     * @name this
     * @description
     *   1. `this`关键字的指向
     *   2. 语法`@this <namePath>`
     */
    this: {
        name: "@this",
        type: "functional",
        syntax: []
    },

    // * - 面向对象 - 混入
    /**
     * @name mixin
     * @description
     *   1. 标识该对象是一个 mixin（混入）对象, 表明该对象的属性和方法混入到其他对象; 然后, 可以将@mixes 标签添加到使用了该 mixin（混入）的对
     *   2. 语法 `@mixin`
     */
    mixin: {
        name: "@mixin",
        type: "functional",
        syntax: []
    },
    /**
     * @name mixes
     * @description
     *   1. 语法`@mixes <OtherObjectPath>`
     *   2. 指示对象混入了`OtherObjectPath`对象的所有成员, 被混入的对象就是一个@mixin
     */
    mixes: {
        name: "@mixes",
        type: "functional",
        syntax: []
    },

    // * - 面向对象 - 列举
    /**
     * @name member
     * @description
     *   1. 列举类的成员
     *   2. 语法 `@member {type} <name> -desc`
     */
    member: {
        name: "@member",
        type: "functional",
        syntax: []
    },
    /**
     * @name memberof
     * @description
     *   1. 标明成员隶属于哪一个类
     *   2. 语法 `@memberof <parentNamepath>`或`@memberof! <parentNamepath>`
     */
    memberof: {
        name: "@memberof",
        type: "functional",
        syntax: []
    },

    // * - 面向对象 - 类型
    /**
     * @name inner
     * @description
     *   1. 将标明该标识符作为它父标识符的内部成员, 它可以通过"Parent~Child"引用
     *   2. 语法 `@inner {type} name - desc`
     */
    inner: {
        name: "@inner",
        type: "functional",
        syntax: []
    },
    /**
     * @name instance
     * @description
     *   1. 将标明该标识符作为它父标识符的实例成员, 它可以通过"Parent#Child"引用
     *   2. 语法 `@instance {type} name - desc`
     */
    instance: {
        name: "@instance",
        type: "functional",
        syntax: []
    },
    /**
     * @name static
     * @description
     *   1. 将标明该标识符作为它父标识符的静态成员, 它可以通过"Parent.Child"引用
     *   2. 语法 `@static {type} name - desc`
     */
    static: {
        name: "@static",
        type: "functional",
        syntax: []
    },

    // * - 面向对象 - 继承
    /**
     * @name extends
     * @description
     *   1. 语法 `@extends <namepath>`
     *   2. 指明标识符继承自哪个父类, 后面需要加父类名
     */
    extends: {
        name: "@extends",
        type: "functional",
        syntax: []
    },
    /**
     * @name class
     * @description
     *   1. 标明函数是一个构造器函数, 意味着需要使用 new 关键字来返回一个实例, 即使用 new 关键字实例化
     *   2. 语法 `@class <name>`
     */
    class: {
        name: "@class",
        type: "functional",
        syntax: []
    },
    /**
     * @name constructs
     * @description
     *   1. 指定字面量对象是`指定类`的实例
     *   2. 语法 `@constructs <name>`
     */
    constructs: {
        name: "@constructs",
        type: "functional",
        syntax: []
    },
    /**
     * @name lends
     * @description
     *   1. 将一个字面量对象的所有成员标记为某个标识符（类或模块）的成员
     *   2. 语法 `@lends <namepath>`
     */
    lends: {
        name: "@lends",
        type: "functional",
        syntax: []
    },

    // * - 面向对象 - 重写
    /**
     * @name override
     * @description
     *   1. 子类重写其父类同名的成员
     *   2. 语法 `@override`
     */
    override: {
        name: "@override",
        type: "functional",
        syntax: []
    },
    /**
     * @name abstract
     * @description
     *   1. 父类的成员必须在子类中实现
     *   2. 语法 `@abstract`
     */
    abstract: {
        name: "@abstract",
        type: "functional",
        syntax: []
    },

    // * - 面向对象 - 接口
    /**
     * @name interface
     * @description
     *   1. 语法 `@interface <name>`
     *   2. 使一个顶层标识符作为其他标识符的一个实现接口, 指明子标识符必须实现父标识符的方法和属性
     */
    interface: {
        name: "@interface",
        type: "functional",
        syntax: []
    },
    /**
     * @name implements
     * @description
     *   1. 标识口实现类, 添加`@implements`到实现接口（例如, 一个构造函数）的顶层标识
     *   2. 语法 `@implements`
     */
    implements: {
        name: "@@name implements",
        type: "functional",
        syntax: []
    },


    // * - 面向对象 - 访问
    /**
     * @name access
     * @description
     *   1. 指定该成员的访问级别（私有 private, 公共 public, 或保护 protected）
     *   2. 语法 `@access <private| protected | public > [target]`
     *   3. `private` 标标识符为私有, 不参与文档化
     *   4. `protected` 表明标识符为受保护的, 通常情况下, 受保护的成员只能在被继承的子类中或在模块内部可以访问
     *   5. `public` 标识符为公开的
     */
    access: {
        name: "@access",
        type: "functional",
        syntax: []
    },
};

module.exports = {
    Tag,
    TagError,
    tags: new Proxy(TAGS, {
        get(target, name, rev) {
            name = getTagName(name);
            return target[name];
        }
    })
};
