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
Webpack4 legacy 版本把 CommonChunkPlugin 移除，用 SplitChunksPlugin 替代 CommonChunkPlugin。CommonChunkPlugin 会把公用模块全都抽取出来，造成入口文件过大，不利于首屏显示，SplitChunksPlugin就是在解决代码重复程度与入口文件大小之间的平衡而设的。

举个官方栗子：

    假设存在以下chunk-a~chunk-d

    chunk-a: react, react-dom, some components

    chunk-b: react, react-dom, some other components

    chunk-c: angular, some components

    chunk-d: angular, some other components

    webpack会自动创建两个chunk模块，结果如下：

    chunk-a~chunk-b: react, react-dom

    chunk-c~chunk-d: angular

    chunk-a to chunk-d: Only the components

Webpack 会根据下述条件自动分割 chunks：
- 新代码块可以被共享引用，OR这些模块都是来自node_modules文件夹里面
- 新代码块大于30kb（min+gziped之前的体积）
- 按需加载的代码块，最大数量应该小于或者等于5
- 初始加载的代码块，最大数量应该小于或等于3
- 当试图满足最后两个条件，首选更大的块

SplitChunksPlugin选项：

    // 哪类型的块可以优化，默认为 all
    chunks: all,
    // 压缩前最小模块大小，默认0（bytes）
    minSize: 0,
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
            // 缓存组的规则
            test,
            // 表示缓存的优先级
            priority,
            // 表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块
            reuseExistingChunk
        },
        ...
    }

按需加载伪代码：

    // Es6 标准，通过注释制定打包后的 chunk 名称
    import(/* webpackChunkName: 'chunk'*/"chunk").then(callback)

    // webpack 内部实现
    require.ensure(["chunk"], callback, chunkName)

## Tree shaking
当在一个模块文件中，引入了另一个模块，但是并没有使用被引入模块的内容时，webpack 依然会把没使用的那部分的代码编译进去，这样会对资源产生浪费，这个时候，若要优化这一方面，我们需要使用摇树（Tree shaking）。这思想最初出自 Rollup，利用 es6 的静态解析特性，在解析阶段就确定输出模块，可以确定哪些模块会被使用，只要在 AST 阶段把 dead code 移除，只剩下被使用部分，这样就能实现 tree-shaking。