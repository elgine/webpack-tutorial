# Webpack
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

### HotModuleReplacementPlugin


### 开箱即用的Webpack-dev-server


### 集成服务端
#### Express
#### Koa2

## 代码分割
>对于大型的web 应用而言，把所有的代码放到一个文件的做法效率很差，特别是在加载了一些只有在特定环境下才会使用到的阻塞的代码的时候。Webpack有个功能会把你的代码分离成Chunk，后者可以按需加载。这个功能就是Code Spliiting

Code Spliting的具体做法就是一个分离点，在分离点中依赖的模块会被打包到一起，可以异步加载。一个分离点会产生一个打包文件。
## 按需加载
代码如下：

    // 第一个参数是依赖列表，webpack会加载模块，但不会执行
    // 第二个参数是一个回调，在其中可以使用require载入模块
    // 下面的代码会把module-a，module-b，module-c打包一个文件中，虽然module-c没有在依赖列表里，但是在回调里调用了，一样会被打包进来
    require.ensure(["module-a", "module-b"], function(require) {
        var a = require("module-a");
        var b = require("module-b");
        var c = require('module-c');
    });