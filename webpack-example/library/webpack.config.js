const path = require("path");
const baseConfig = require("../webpack.config.base");
const merge = require("webpack-merge");

module.exports = merge(baseConfig, {
    entry: path.resolve(__dirname, "./math.js"),
    mode: "development",
    output: {
        path: path.resolve(__dirname, "./dest"),
        filename: "[name].js",
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
});