# Webpack 实战
## 开发模式与生产模式
Webpack具有配置多样性，一些是在“开发模式”（development）下使用的，一些是“生产模式”下才能使用的，某些是共用的。举个栗子：

![image](./webpack-config-dev-prod.png)

所以在配置前端工程化得时候，我们一般会把共用部分抽取出来，然后根据项目需求，把各个环境的配置分成一个文件，利用Mixins，与共用部分混合，组成完整的config文件。

## 热替换
在开发的时候，我们经常会修改某个源文件，但是每次修改都不想刷新页面，如果是修改后台代码，又不想重启服务器，这时候就需要热替换（HMR）。

HMR会在webapp运行过程中动态增加，删除，添加<font color=#2196F3><b>模块<b></font>，而无需重新加载页面。
### 原理
- 监听文件修改变化，通知 Compiler 重新编译
- Compiler 重新编译构建修改的一个或多个模块，通知 HMR服务器 进行更新
- HMR Server 通过 websocket 通知 HMR Runtime 需要更新
- HMR Runtime 替换更新中的模块

Webpack 向 client 暴露了一系列 HMR Runtime API，可以让客户端在 HMR 的某个时刻做一些有趣的事情。

### 开箱即用的Webpack-dev-server
若你开发的webapp正处于测试阶段且与后台数据没有依赖关系的话，使用 webpack-dev-server 将是最能加快你开发进度的 HMR 插件。Webpack 内部集成了 Webpack-dev-server 配置项，只要配置好 devServer，以及插入 webpack.HotModuleReplacementPlugin 插件即可达到开箱即用。

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
若是需要与node.js后端联合开发，且希望不想另外搭建一个静态页面服务器的话，那你就需要使用 middleware 集成 HMR了。要在服务端集成 HMR，最快的方案，你需要两个middleware，分别是 webpack-dev-middleware 与 webpack-hot-middleware。

Webpack-dev-middleware 在 webpack 模块依赖图基础上构建了一套内存文件的缓存系统，把负责将编译后的文件以内存方式存储在服务器中，因为是储存在内存中， 因此访问速度比硬盘读取快。Webpack-hot-middleware 则负责HMR服务器与客户端之间的热更新数据传递。

以 Express 为例，只要导入 Webpack-dev-middleware 与 Webpack-hot-middleware，并挂载在 Express 的实例上，服务端的配置基本完成，当然，两个中间件各有不同的参数，你可以翻阅官方文档进行查阅。而在 webpack 配置文件中，需要在 entry 上添加 "webpack-hot-middleware/client?xxx=xxx"，记得在 plugins 中注册 HotModuleReplacementPlugin即可。

## 代码分割与按需加载
我们通常会设置 webpack 的打包输出为一个bundle，在一般情况下，我们是不需要做什么修改的，但是如果你需要在首屏显示上获得更高性能，那么有一步你是必须要做的就是，code spliting 与 lazy load。

自 webpack4 legacy 版本推出之后，webpack 官方把 commonChunkPlugin 移除，新增加一个 Plugin，用于替代 commonChunkPlugin，它就是 splitChunksPlugin，配置选项也跟原来的不太一样，因此，从 webpack3 迁移到 webpack4 的同志们要注意了。

splitChunksPlugin 的配置项，既可以在 Plugin 引用 splitChunksPlugin 的时候注入进去，也可以在 optimization.splitChunks 里设置，配置选项基本都是一样的。

webpack 会根据下述条件自动进行 code spliting：
- 新代码块可以被共享引用，OR这些模块都是来自node_modules文件夹里面
- 新代码块大于30kb（min+gziped之前的体积）
- 按需加载的代码块，最大数量应该小于或者等于5
- 初始加载的代码块，最大数量应该小于或等于3

## Tree shaking
当我们在一个模块文件中，引入了另一个模块，但是并没有使用被引入模块的内容时，webpack 依然会把没使用的那部分的代码编译进去，这样会对资源产生浪费，这个时候，若要优化这一方面，我们需要使用摇树（Tree shaking）。

### 设置
- 在 package.json 中设置 sideEffects，这选项标志了该模块是否有副作用