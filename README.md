# Webpack 从入门到放弃
![image](./webpack.png)

## Webpack 是什么？为什么使用 webpack ？
### 模块化
ES6之前，JavaScript没有原生的模块机制，不过由于 Javascript 的作用域管理机制，可以隔离作用域，避免污染作用域，起到模块化的作用：

    // IIFE
    var module = (function(options){
        return ...;
    })(options);

    // Closure
    var Person = function(){
        function Person{
            ...
        }
        Person.prototype.xxx = function(){
            ...
        }
        return Person;
    }

向上面这类代码，在一些小型应用，依赖关系不是很复杂的情况下，人工去管理这种模块是没有什么问题的，但是随着项目的增大，依赖越来越大的情况下，这就会变成 disaster。

这里引用官方的介绍：
> 本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

Webpack 的存在打破了长期以来 Javascript 开发的一大痛点 —— 模块化管理。当然，Webpack 还有以下特点：
- 模块化，支持 AMD、CommonJs、UMD，解决了 Js 长期以来的开发痛点
- 高度可配置化，开箱即用，灵活性强，配置简单
- 扩展性强，插件完善，有庞大的社区支持
- 详细地开发文档（2.0之后）

## 打包原理
### 核心概念
- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

### 流程
1. 初始化阶段，读取合并配置参数，初始化 loader 与 plugin，实例化 compiler，compiler 调用 run 方法开始编译
2. 编译阶段，从入口文件出发，使用相应的 loader 解析内容，使 webpack 能够识别处理的有效模块，并递归进行编译处理，最后遍历完所有模块文件，生成 “模块依赖图” 
3. 输出阶段，根据模块生成 chunk，把 chunk 写入文件，存入文件系统或者内存文件系统 

[webpack 详细流程图](./webpack-workflow.jpg)

### 模块管理
#### runtime
>在浏览器运行时，webpack 用来连接模块化的应用程序的所有代码。runtime包括：在模块交互时，连接模块所需的加载和解析逻辑。包括浏览器中的已加载模块的连接以及懒加载模块的执行逻辑。

#### mainfest
>当编译器开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为“mainfest”，当完成打包并发送到浏览器时，会在运行时通过 mainfest 来解析和加载模块。

Webpack4 runtime 代码由 runtimeChunkPlugin 导出，
一般 webpack 导出的 runtime 文件代码结构大概是这样的：

    (function(modules) {
        // 已经加载的模块
        var installedModules = {};
        // 加载方法
        function __webpack_require__(moduleId) {
            ...
        }
    })({...};

runtime 里的模块管理主要由下面三个部分构成：

    // 所有模块的生成代码，
    var modules；
    // 所有已经加载的模块，作为缓存表
    var installedModules；
    // 加载模块的函数
    function webpack_require(moduleId);

webpack_require 的源码大概是这样：

    // 加载完毕的所有模块。
    var installedModules = {};
    
    function webpack_require(moduleId) {
        // 如果模块已经加载过了，直接从Cache中读取。
        if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
        }
    
        // 创建新模块并添加到installedModules。
        var module = installedModules[moduleId] = {
            id: moduleId,
            exports: {}
        };
    
        // 加载模块，即运行模块的生成代码，
        modules[moduleId].call(module.exports, module, module.exports, webpack_require);
    
        return module.exports;
    }

## 运行原理

Webpack 内部架构是基于 Tapable 构建的，Tapable 是一个用于事件发布订阅执行的插件架构。插件通过被 Webpack 调用 apply 的方式，往 compiler 上注册事件，来监听 webpack 的运行周期的某个时刻触发的事件来完成自己的功能需求。

### Compiler
>Webpack 初始化时创建的单例对象，基于 Tapable 的实例，整个 webpack 生命周期里只有一个，包含了 webpack 的所有环境描述。

### Compilation
>compilation 对象代表了一次单一的版本构建和生成资源，基于 Tapable 的实例。当运行 webpack 时，每当检测到一个文件变化，一次新的编译将被创建，从而生成一组新的编译资源。一个编译对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。

### Plugin
Webpack 插件有以下特点：
- 独立的 JS 模块，暴露相应的函数
- 函数原型上的 apply 方法会注入 compiler 对象
- compiler 对象上挂载了相应的 webpack 事件钩子
- 事件钩子的回调函数里能拿到编译后的 compilation 对象，如果是异步钩子还能获取相应的 callback

一般的插件定义形式：

    function Plugin(options){
        ...
    }

    // Webpack 会调用 apply 方法并注入 compiler
    Plugin.prototype.apply = function(compiler){
        // 通过 plugin 可以获取 compilation，Webpack 会在特定时间 broadcast 事件
        compiler.plugin("event", function(compilation, callback){
            ...
        });
        ...
    }

下面是一些常见的时间钩子的说明：

| 钩子 | 作用 | 参数 | 类型 |
| ------ | ------ | ------ | ------ |
|after-plugins | 设置完一组初始化插件之后 | compiler | sync |
|after-resolvers | 设置完 resolvers 之后 | compiler | sync |
|run | 在读取记录之前 | compiler | async |
|compile | 在创建新 compilation 之前 | compilationParams | sync |
|compilation | compilation 创建完成 | compilation | sync |
|emit | 在生成资源并输出到目录之前 | compilation | async |
|after-emit | 在生成资源并输出到目录之后 | compilation | async |
|done | 完成编译 | stats | sync |
