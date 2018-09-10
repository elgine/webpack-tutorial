const webpack = require("webpack");
const baseConfig = require("../webpack.config.base");
const merge = require("webpack-merge");
const path = require("path");
module.exports = merge(baseConfig, {
    entry: {
        main: path.resolve(__dirname, "./main.js"),
        // cancel: path.resolve(__dirname, "./cancel.js"),
        // confirm: path.resolve(__dirname, "./confirm.js")
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "./dest"),
        chunkFilename: "[name].chunk.js"
    },
    mode: "development",
    plugins: [
        new webpack.optimize.SplitChunksPlugin({
            chunks: "all",
            minSize: 0,
            maxAsyncRequests: 3,
            maxInitialRequests: 3,
            cacheGroups: {
                // 注意: priority属性
                // 其次: 打包业务中公共代码
                common: {
                    name: "common",
                    chunks: "all",
                    minSize: 2,
                    priority: 0
                },
                // 首先: 打包node_modules中的文件
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10
                }
            }
        })
    ]
});