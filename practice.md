# Webpack 实战

## 开发模式与生产模式
Webpack具有配置多样性，一些是在“开发模式”（development）下使用的，一些是“生产模式”下才能使用的，某些是共用的。举个栗子：

![image](./webpack-config-dev-prod.png)

所以在配置前端工程化得时候，我们一般会把共用部分抽取出来，然后根据项目需求，把各个环境的配置分成一个文件，利用Mixins，与共用部分混合，组成完整的config文件。

## 生产模式下发布库

    output: {
        ...
        // 导出的 library 名称
        library: "math",
        // var （默认值）当 library 加载完成，入口起点的返回值将分配给一个变量
        // assign 这将产生一个隐含的全局变量，可能会潜在地重新分配到全局中已存在的值（谨慎使用）
        // this 入口起点的返回值将分配给 this 的一个属性
        // window 分配到 window 对象上
        // global 分配给 global 对象
        // commonjs|commonjs2 分配给 exports 对象
        // amd 暴露为 AMD 模块
        // umd 将你的 library 暴露为所有的模块定义下都可运行的方式。它将在 CommonJS, AMD 环境下运行，或将模块导出到 global 下的变量
        libraryTarget: "umd",
        // 设置导出模块
        libraryExport: "default"
    }

## 热替换
在开发阶段，若经常修改某个源文件，导致服务器或者客户端需要重新重启或者刷新才能看到效果，这必然会耗费大量时间，热替换（HMR）就是为了解决这个问题而设立的。

>HMR会在webapp运行过程中动态增加，删除，添加模块，而无需重新加载页面。

### 原理
- 监听文件修改变化，通知 Compiler 重新编译
- Compiler 重新编译构建修改的一个或多个模块，通知 HMR服务器 进行更新
- HMR Server 通过 websocket 通知 HMR Runtime 需要更新
- HMR Runtime 替换更新中的模块

Webpack 向 client 暴露了一系列 HMR Runtime API，可以让客户端在 HMR 的某个时刻做一些有趣的事情。

### 开箱即用的Webpack-dev-server
Webpack-dev-server 是一款开箱即用的 HMR 插件，且 Webpack 内部集成了 Webpack-dev-server 配置项，只要配置好 devServer，以及注入 webpack.HotModuleReplacementPlugin 插件即可使用。

    // Npm scripts
    webpack-dev-server --colors --progress

    // entry.js
    if (module.hot) {
        module.hot.accept("./xxx.js", function() {
            console.log("Accepting the updated printMe module!");
        })
    }

    // webpack.config.js
    module.exports = merge(baseConfig, {
        ...,
        devServer: {
            port: 3000,
            host: "localhost",
            contentBase: path.join(__dirname, "dest"),
            hot: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });

### DevServer与后端服务器结合
当你有一个单独的 API 后端服务器，且想在同一域下调用这些 API，你就需要用到 proxy 属性。

    proxy: {
        '/proxy': {
            target: 'http://your_api_server.com',
            changeOrigin: true,
            pathRewrite: {
                '^/proxy': ''
            }
    }


### 集成node.js服务端
若是需要与node.js后端联合开发，且希望不想另外搭建一个静态页面服务器集成 HMR，对于这种情况，需要两个middleware，分别是 webpack-dev-middleware 与 webpack-hot-middleware。

Webpack-dev-middleware 在 webpack 模块依赖图基础上构建了一套内存文件的缓存系统，把负责将编译后的文件以内存方式存储在服务器中，因为是储存在内存中， 因此访问速度比硬盘读取快。Webpack-hot-middleware 则负责HMR服务器与客户端之间的热更新数据传递。

以 Express 为例，只要导入 Webpack-dev-middleware 与 Webpack-hot-middleware，并挂载在 Express 的实例上，服务端的配置基本完成，当然，两个中间件各有不同的参数，你可以翻阅官方文档进行查阅。而在 webpack 配置文件中，需要在 entry 上添加 "webpack-hot-middleware/client?xxx=xxx"，然后在 plugins 中注册 HotModuleReplacementPlugin即可。

## 代码分割与按需加载
Webpack4 版本把 CommonChunkPlugin 移除，用 SplitChunksPlugin 替代 CommonChunkPlugin。CommonChunkPlugin 会把公用模块全都抽取出来，造成入口文件过大，不利于首屏显示，SplitChunksPlugin就是在解决代码重复程度与入口文件大小之间的平衡而设的。

Webpack 会根据下述条件自动分割 chunks：
- 新代码块可以被共享引用，or 这些模块都是来自node_modules文件夹里面
- 新代码块大于30kb（min+gziped之前的体积）
- 按需加载的代码块，最大数量应该小于或者等于5
- 初始加载的代码块，最大数量应该小于或等于3
- 当试图满足最后两个条件，首选更大的块

SplitChunksPlugin选项：

    // 哪类型的块可以优化，默认为 all
    chunks: all,
    // 压缩前最小模块大小，默认0（bytes）
    minSize: 30000,
    // 表示代码分割前必须共享模块的最小块数量
    minChunks: 1,
    // 最大按需（异步）加载次数，默认为1
    maxAsyncRequests: 1,
    // 最大初始化加载次数，默认为1
    maxInitialRequests: 1,
    // 拆分出来块的名字，默认由块名和hash值自动生成
    name: [name] + [hash],
    // 模块最大大小，用于告诉 webpack 尝试将大于 maxSize的块拆分成更小的部分。Chunk 的尺寸最小为 minSize。
    maxSize,
    // 缓存组
    cacheGroups: {
        // 缓存组继承 splitChunks 的所有设置项，且可以覆盖原值
        [key]: {
            // 缓存组的匹配规则
            test,
            // 表示制作缓存组的优先级
            priority,
            // 表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块
            reuseExistingChunk
        },
        ...
    }

按需加载伪代码：

    // Es6 标准，通过注释制定打包后的 chunk 名称
    import(/* webpackChunkName: 'chunk'*/"chunk").then(callback)

    // webpack 内部实现
    require.ensure(["chunk"], callback, chunkName)

## Tree shaking
当在一个模块文件中，引入了另一个模块，但是并没有使用被引入模块的内容时，webpack 依然会把没使用的那部分的代码编译进去，这样会对资源产生浪费，这个时候，若要优化这一方面，我们需要使用摇树（Tree shaking）。这思想最初出自 Rollup，利用 es6 的静态解析特性，在解析阶段就确定输出模块，可以确定哪些模块会被使用，只要在 AST 阶段把 dead code 移除，只剩下被使用部分，这样就能实现 tree-shaking。

## 自定义 Loader

    const loaderUtils = require("loader-utils");
    // source 为 compiler 传递给 Loader 的一个文件的原内容
    // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
    module.exports = function(source){
        // 获取 options
        const options = loaderUtils.getOptions(this);
        ...
        // 关闭缓存功能
        // this.cacheable(false);
        // 使用 callback 多结果返回
        this.callback(
            // 当无法转换原内容时，给 Webpack 返回一个 Error
            err: Error | null,
            // 原内容转换后的内容
            content: string | Buffer,
            // 用于把转换后的内容得出原内容的 Source Map，方便调试
            sourceMap?: SourceMap,
            // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回，
            // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
            abstractSyntaxTree?: AST
        );
        // 只输出编译结果
        // return source;
    }

>Source Map 的生成很耗时，通常在开发环境下才会生成 Source Map，其它环境下不用生成，以加速构建。 为此 Webpack 为 Loader 提供了 this.sourceMap API 去告诉 Loader 当前构建环境下用户是否需要 Source Map。 如果你编写的 Loader 会生成 Source Map，请考虑到这点。

除了上述提到的能调用的 Webpack API 外，还有以下常用的 API：
- this.context：当前处理文件的所在目录，假如当前 Loader 处理的文件是 /src/main.js，则 this.context 就等于 /src。
- this.resource：当前处理文件的完整请求路径，包括 querystring，例如 /src/main.js?name=1。
- this.resourcePath：当前处理文件的路径，例如 /src/main.js。
- this.resourceQuery：当前处理文件的 querystring。
- this.target：等于 Webpack 配置中的 Target。
- this.loadModule：但 Loader 在处理一个文件时，如果依赖其它文件的处理结果才能得出当前文件的结果时， 就可以通过 
- this.loadModule(request: string, callback: function(err, source, sourceMap, module)) 去获得 request 对应文件的处理结果。
- this.resolve：像 require 语句一样获得指定文件的完整路径，使用方法为 resolve(context: string, request: string, callback: function(err, result: string))。
- this.addDependency：给当前处理文件添加其依赖的文件，以便再其依赖的文件发生变化时，会重新调用 Loader 处理该文件。使用方法为 addDependency(file: string)。
- this.addContextDependency：和 addDependency 类似，但 addContextDependency 是把整个目录加入到当前正在处理文件的依赖中。使用方法为 addContextDependency(directory: string)。
- this.clearDependencies：清除当前正在处理文件的所有依赖，使用方法为 clearDependencies()。
- this.emitFile：输出一个文件，使用方法为 emitFile(name: string, content: Buffer|string, sourceMap: {...})。

### 加载本地 Loader
#### Npm link
Npm link 专门用于开发和调试本地 Npm 模块，能做到在不发布模块的情况下，把本地的一个正在开发的模块的源码链接到项目的 node_modules 目录下，让项目可以直接使用本地的 Npm 模块。 由于是通过软链接的方式实现的，编辑了本地的 Npm 模块代码，在项目中也能使用到编辑后的代码。

步骤如下：
- 确保正在开发的本地 Npm 模块（也就是正在开发的 Loader）的 package.json 已经正确配置好；
- 在本地 Npm 模块根目录下执行 npm link，把本地模块注册到全局；
- 在项目根目录下执行 npm link loader-name，把第2步注册到全局的本地 Npm 模块链接到项目的 node_moduels 下，其中的 loader-name 是指在第1步中的 package.json 文件中配置的模块名称。

#### ResolveLoader
ResolveLoader 用于配置 Webpack 如何寻找 Loader。 默认情况下只会去 node_modules 目录下寻找，为了让 Webpack 加载放在本地项目中的 Loader 需要修改 resolveLoader.modules。

假如本地的 Loader 在项目目录中的 ./loaders/loader-name 中，则需要如下配置：

    module.exports = {
        resolveLoader:{
            // 去哪些目录下寻找 Loader，有先后顺序之分
            modules: ['node_modules','./loaders/'],
        }
    }

加上以上配置后， Webpack 会先去 node_modules 项目下寻找 Loader，如果找不到，会再去 ./loaders/ 目录下寻找。